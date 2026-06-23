import { BaseRepository } from './base.repository';
import { Application, IApplication } from '../models/application.model';

class ApplicationRepository extends BaseRepository<IApplication> {
  constructor() {
    super(Application);
  }

  findByJobAndApplicant(jobId: string, applicantId: string) {
    return this.model.findOne({ job: jobId, applicant: applicantId }).exec();
  }
}

export const applicationRepository = new ApplicationRepository();
