import fs from 'fs/promises';
import { resumeRepository } from '../repositories/resume.repository';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { ResumeParseStatus } from '../constants';
import { extractTextFromFile } from './textExtraction.service';
import { llmService } from './llm.service';
import { logger } from '../config/logger';
import { IResume } from '../models/resume.model';

class ResumeService {
  /**
   * Create a resume record from an uploaded file, extract its text, run the
   * parser (LLM or heuristic), and sync derived data onto the seeker profile.
   */
  async uploadAndParse(ownerId: string, file: Express.Multer.File, makePrimary = true): Promise<IResume> {
    const resume = await resumeRepository.create({
      owner: ownerId as never,
      originalName: file.originalname,
      storedName: file.filename,
      filePath: file.path,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      parseStatus: ResumeParseStatus.PROCESSING,
      isPrimary: makePrimary,
    });

    try {
      const rawText = await extractTextFromFile(file.path, file.mimetype);
      const { parsed, parsedBy } = await llmService.parseResume(rawText);

      resume.rawText = rawText;
      resume.parsed = parsed;
      resume.parsedBy = parsedBy;
      resume.parseStatus = ResumeParseStatus.COMPLETED;
      await resume.save();

      if (makePrimary) {
        await resumeRepository.unsetPrimaryForOwner(ownerId, resume._id.toString());
        await this.syncSeekerProfile(ownerId, resume);
      }
    } catch (err) {
      resume.parseStatus = ResumeParseStatus.FAILED;
      resume.parseError = (err as Error).message;
      await resume.save();
      logger.error(`Resume parse failed for ${resume._id}: ${(err as Error).message}`);
    }

    return resume;
  }

  /** Re-run parsing on an existing resume (e.g. after configuring an LLM key). */
  async reparse(resumeId: string, ownerId: string): Promise<IResume> {
    const resume = await resumeRepository.findByIdWithText(resumeId);
    if (!resume) throw ApiError.notFound('Resume not found');
    this.assertOwnership(resume, ownerId);

    const rawText = resume.rawText || (await extractTextFromFile(resume.filePath, resume.mimeType));
    const { parsed, parsedBy } = await llmService.parseResume(rawText);
    resume.rawText = rawText;
    resume.parsed = parsed;
    resume.parsedBy = parsedBy;
    resume.parseStatus = ResumeParseStatus.COMPLETED;
    resume.parseError = undefined;
    await resume.save();

    if (resume.isPrimary) await this.syncSeekerProfile(ownerId, resume);
    return resume;
  }

  async listForOwner(ownerId: string) {
    return resumeRepository.findByOwner(ownerId);
  }

  async getById(resumeId: string, ownerId: string) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw ApiError.notFound('Resume not found');
    this.assertOwnership(resume, ownerId);
    return resume;
  }

  async setPrimary(resumeId: string, ownerId: string) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw ApiError.notFound('Resume not found');
    this.assertOwnership(resume, ownerId);

    await resumeRepository.unsetPrimaryForOwner(ownerId, resumeId);
    resume.isPrimary = true;
    await resume.save();
    await this.syncSeekerProfile(ownerId, resume);
    return resume;
  }

  async remove(resumeId: string, ownerId: string) {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) throw ApiError.notFound('Resume not found');
    this.assertOwnership(resume, ownerId);

    await resumeRepository.deleteById(resumeId);
    await fs.unlink(resume.filePath).catch(() => undefined); // best-effort cleanup

    // Detach from profile if it was the active resume.
    const user = await userRepository.findById(ownerId);
    if (user?.seekerProfile?.activeResume?.toString() === resumeId) {
      user.seekerProfile.activeResume = undefined;
      await user.save();
    }
  }

  /** Copy parsed skills / experience / contact info onto the seeker profile. */
  private async syncSeekerProfile(ownerId: string, resume: IResume) {
    const user = await userRepository.findById(ownerId);
    if (!user) return;
    const parsed = resume.parsed;
    user.seekerProfile = {
      ...(user.seekerProfile ?? { skills: [] }),
      activeResume: resume._id,
      skills: parsed?.skills?.length ? parsed.skills : user.seekerProfile?.skills ?? [],
      experienceYears: parsed?.totalExperienceYears ?? user.seekerProfile?.experienceYears,
      location: parsed?.location ?? user.seekerProfile?.location,
      phone: parsed?.phone ?? user.seekerProfile?.phone,
      links: parsed?.links?.length ? parsed.links : user.seekerProfile?.links,
    };
    await user.save();
  }

  private assertOwnership(resume: IResume, ownerId: string) {
    if (resume.owner.toString() !== ownerId) {
      throw ApiError.forbidden('You do not have access to this resume');
    }
  }
}

export const resumeService = new ResumeService();
