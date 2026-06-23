import { FilterQuery } from 'mongoose';
import { applicationRepository } from '../repositories/application.repository';
import { jobRepository } from '../repositories/job.repository';
import { resumeRepository } from '../repositories/resume.repository';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { getPaginationOptions } from '../utils/pagination';
import { ApplicationStatus, JobStatus, UserRole } from '../constants';
import { IApplication } from '../models/application.model';
import { llmService } from './llm.service';

interface ApplyInput {
  jobId: string;
  resumeId?: string;
  coverLetter?: string;
}

/** Allowed status transitions an employer/admin may apply. */
const EMPLOYER_TRANSITIONS = new Set<ApplicationStatus>([
  ApplicationStatus.REVIEWING,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFERED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.HIRED,
]);

class ApplicationService {
  async apply(applicantId: string, input: ApplyInput) {
    const job = await jobRepository.findById(input.jobId);
    if (!job) throw ApiError.notFound('Job not found');
    if (job.status !== JobStatus.OPEN) throw ApiError.badRequest('This job is not accepting applications');

    const already = await applicationRepository.findByJobAndApplicant(input.jobId, applicantId);
    if (already) throw ApiError.conflict('You have already applied to this job');

    // Resolve which resume to attach (explicit > primary/active).
    const resume = await this.resolveResume(applicantId, input.resumeId);

    // Compute AI match score between the resume and the job.
    const match = await llmService.scoreMatch({
      candidateSkills: resume.parsed?.skills ?? [],
      candidateSummary: resume.parsed?.summary,
      candidateExperienceYears: resume.parsed?.totalExperienceYears,
      jobTitle: job.title,
      jobSkills: job.skills,
      jobDescription: job.description,
      jobRequirements: job.requirements,
    });

    const application = await applicationRepository.create({
      job: job._id,
      applicant: applicantId as never,
      employer: job.employer,
      resume: resume._id,
      coverLetter: input.coverLetter,
      status: ApplicationStatus.APPLIED,
      matchScore: match.matchScore,
      matchInsights: {
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        summary: match.summary,
      },
      timeline: [{ status: ApplicationStatus.APPLIED, at: new Date(), by: applicantId as never }],
    });

    await jobRepository.incrementApplications(job._id.toString(), 1);
    return application.toJSON();
  }

  /** Seeker's own applications. */
  async listForApplicant(applicantId: string, query: Record<string, unknown>) {
    const pagination = getPaginationOptions(query);
    const filter: FilterQuery<IApplication> = { applicant: applicantId };
    if (query.status) filter.status = query.status as ApplicationStatus;
    return applicationRepository.paginate(filter, pagination, [
      { path: 'job', select: 'title slug companyName location jobType workMode status' },
    ]);
  }

  /** Applications for a specific job (employer view). */
  async listForJob(jobId: string, employerId: string, role: UserRole, query: Record<string, unknown>) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw ApiError.notFound('Job not found');
    if (role !== UserRole.ADMIN && job.employer.toString() !== employerId) {
      throw ApiError.forbidden('You cannot view applications for this job');
    }

    const pagination = getPaginationOptions({ sort: '-matchScore', ...query });
    const filter: FilterQuery<IApplication> = { job: jobId };
    if (query.status) filter.status = query.status as ApplicationStatus;

    return applicationRepository.paginate(filter, pagination, [
      { path: 'applicant', select: 'name email avatar seekerProfile' },
      { path: 'resume', select: 'originalName parsed parseStatus parsedBy' },
    ]);
  }

  async getById(applicationId: string, userId: string, role: UserRole) {
    const application = await applicationRepository.findById(applicationId, undefined, [
      { path: 'job', select: 'title slug companyName employer' },
      { path: 'applicant', select: 'name email avatar seekerProfile' },
      { path: 'resume', select: 'originalName parsed parseStatus filePath' },
    ]);
    if (!application) throw ApiError.notFound('Application not found');

    const isOwnerSeeker = application.applicant._id?.toString() === userId;
    const isOwnerEmployer = application.employer.toString() === userId;
    if (role !== UserRole.ADMIN && !isOwnerSeeker && !isOwnerEmployer) {
      throw ApiError.forbidden('You do not have access to this application');
    }
    return application.toJSON();
  }

  async updateStatus(
    applicationId: string,
    actorId: string,
    role: UserRole,
    status: ApplicationStatus,
    note?: string,
  ) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw ApiError.notFound('Application not found');

    if (role !== UserRole.ADMIN && application.employer.toString() !== actorId) {
      throw ApiError.forbidden('Only the employer can update this application');
    }
    if (!EMPLOYER_TRANSITIONS.has(status)) {
      throw ApiError.badRequest(`Invalid status transition: ${status}`);
    }

    application.status = status;
    application.timeline.push({ status, note, at: new Date(), by: actorId as never });
    await application.save();
    return application.toJSON();
  }

  /** Seeker withdraws their own application. */
  async withdraw(applicationId: string, applicantId: string) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw ApiError.notFound('Application not found');
    if (application.applicant.toString() !== applicantId) {
      throw ApiError.forbidden('You can only withdraw your own application');
    }
    if (application.status === ApplicationStatus.HIRED) {
      throw ApiError.badRequest('Cannot withdraw an application that has been hired');
    }

    application.status = ApplicationStatus.WITHDRAWN;
    application.timeline.push({
      status: ApplicationStatus.WITHDRAWN,
      at: new Date(),
      by: applicantId as never,
    });
    await application.save();
    await jobRepository.incrementApplications(application.job.toString(), -1);
    return application.toJSON();
  }

  private async resolveResume(applicantId: string, resumeId?: string) {
    if (resumeId) {
      const resume = await resumeRepository.findById(resumeId);
      if (!resume) throw ApiError.notFound('Resume not found');
      if (resume.owner.toString() !== applicantId) {
        throw ApiError.forbidden('You do not own this resume');
      }
      return resume;
    }

    // Fall back to the user's active resume, then their newest.
    const user = await userRepository.findById(applicantId);
    const activeId = user?.seekerProfile?.activeResume?.toString();
    if (activeId) {
      const active = await resumeRepository.findById(activeId);
      if (active) return active;
    }
    const [latest] = await resumeRepository.findByOwner(applicantId);
    if (!latest) throw ApiError.badRequest('Please upload a resume before applying');
    return latest;
  }
}

export const applicationService = new ApplicationService();
