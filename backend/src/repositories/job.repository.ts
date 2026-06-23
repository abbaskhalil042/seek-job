import { BaseRepository } from './base.repository';
import { IJob, Job } from '../models/job.model';

class JobRepository extends BaseRepository<IJob> {
  constructor() {
    super(Job);
  }

  findBySlug(slug: string) {
    return this.model.findOne({ slug }).populate('employer', 'name employerProfile avatar').exec();
  }

  incrementViews(id: string) {
    return this.model.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
  }

  incrementApplications(id: string, delta = 1) {
    return this.model.findByIdAndUpdate(id, { $inc: { applicationCount: delta } }).exec();
  }

  /** Distinct skills across open jobs — handy for filters / autocomplete. */
  distinctSkills() {
    return this.model.distinct('skills', { status: 'open' }).exec();
  }
}

export const jobRepository = new JobRepository();
