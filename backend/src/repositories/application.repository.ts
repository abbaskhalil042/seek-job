import { PipelineStage } from 'mongoose';
import { BaseRepository } from './base.repository';
import { Application, IApplication } from '../models/application.model';

class ApplicationRepository extends BaseRepository<IApplication> {
  constructor() {
    super(Application);
  }

  findByJobAndApplicant(jobId: string, applicantId: string) {
    return this.model.findOne({ job: jobId, applicant: applicantId }).exec();
  }

  /** Run an arbitrary aggregation pipeline (used by analytics). */
  aggregate<R = Record<string, unknown>>(pipeline: PipelineStage[]): Promise<R[]> {
    return this.model.aggregate<R>(pipeline).exec();
  }
}

export const applicationRepository = new ApplicationRepository();
