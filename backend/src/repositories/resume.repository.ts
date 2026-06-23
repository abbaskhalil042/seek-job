import { BaseRepository } from './base.repository';
import { IResume, Resume } from '../models/resume.model';

class ResumeRepository extends BaseRepository<IResume> {
  constructor() {
    super(Resume);
  }

  findByOwner(ownerId: string) {
    return this.model.find({ owner: ownerId }).sort('-createdAt').exec();
  }

  /** Returns a resume including its raw text (normally `select: false`). */
  findByIdWithText(id: string) {
    return this.model.findById(id).select('+rawText').exec();
  }

  /** Demotes every other resume for an owner so only one stays primary. */
  unsetPrimaryForOwner(ownerId: string, exceptId?: string) {
    const filter: Record<string, unknown> = { owner: ownerId, isPrimary: true };
    if (exceptId) filter._id = { $ne: exceptId };
    return this.model.updateMany(filter, { $set: { isPrimary: false } }).exec();
  }
}

export const resumeRepository = new ResumeRepository();
