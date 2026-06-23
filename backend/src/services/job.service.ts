import { FilterQuery } from 'mongoose';
import { jobRepository } from '../repositories/job.repository';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { uniqueSlug } from '../utils/slug';
import { getPaginationOptions } from '../utils/pagination';
import { IJob } from '../models/job.model';
import {
  ExperienceLevel,
  JobStatus,
  JobType,
  UserRole,
  WorkMode,
} from '../constants';

interface CreateJobInput {
  title: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  location?: string;
  salary?: IJob['salary'];
  openings?: number;
  deadline?: string;
  status?: JobStatus;
}

class JobService {
  async create(employerId: string, input: CreateJobInput) {
    const employer = await userRepository.findById(employerId);
    if (!employer) throw ApiError.notFound('Employer not found');

    const job = await jobRepository.create({
      ...input,
      slug: uniqueSlug(input.title),
      employer: employer._id,
      companyName: employer.employerProfile?.companyName,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      status: input.status ?? JobStatus.OPEN,
    } as Partial<IJob>);

    return job.toJSON();
  }

  async update(jobId: string, employerId: string, role: UserRole, input: Partial<CreateJobInput>) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw ApiError.notFound('Job not found');
    this.assertOwnership(job, employerId, role);

    Object.assign(job, {
      ...input,
      deadline: input.deadline ? new Date(input.deadline) : job.deadline,
    });
    await job.save();
    return job.toJSON();
  }

  async remove(jobId: string, employerId: string, role: UserRole) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw ApiError.notFound('Job not found');
    this.assertOwnership(job, employerId, role);
    await jobRepository.deleteById(jobId);
  }

  async updateStatus(jobId: string, employerId: string, role: UserRole, status: JobStatus) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw ApiError.notFound('Job not found');
    this.assertOwnership(job, employerId, role);
    job.status = status;
    await job.save();
    return job.toJSON();
  }

  async getBySlug(slug: string, incrementView = true) {
    const job = await jobRepository.findBySlug(slug);
    if (!job) throw ApiError.notFound('Job not found');
    if (incrementView) await jobRepository.incrementViews(job._id.toString());
    return job.toJSON();
  }

  async getById(jobId: string) {
    const job = await jobRepository.findById(jobId, undefined, {
      path: 'employer',
      select: 'name employerProfile avatar',
    });
    if (!job) throw ApiError.notFound('Job not found');
    return job.toJSON();
  }

  /** Public job search with filters, full-text query & pagination. */
  async search(query: Record<string, unknown>) {
    const pagination = getPaginationOptions(query);
    const filter: FilterQuery<IJob> = { status: JobStatus.OPEN };

    if (typeof query.q === 'string' && query.q.trim()) {
      filter.$text = { $search: query.q.trim() };
    }
    if (query.jobType) filter.jobType = query.jobType as JobType;
    if (query.workMode) filter.workMode = query.workMode as WorkMode;
    if (query.experienceLevel) filter.experienceLevel = query.experienceLevel as ExperienceLevel;
    if (typeof query.location === 'string' && query.location.trim()) {
      filter.location = { $regex: query.location.trim(), $options: 'i' };
    }
    if (typeof query.skills === 'string' && query.skills.trim()) {
      const skills = query.skills.split(',').map((s) => s.trim()).filter(Boolean);
      if (skills.length) filter.skills = { $in: skills.map((s) => new RegExp(`^${escapeRegex(s)}$`, 'i')) };
    }
    if (query.minSalary) {
      filter['salary.max'] = { $gte: Number(query.minSalary) };
    }

    return jobRepository.paginate(filter, pagination, {
      path: 'employer',
      select: 'name employerProfile avatar',
    });
  }

  /** Jobs created by a specific employer (their dashboard listing). */
  async listByEmployer(employerId: string, query: Record<string, unknown>) {
    const pagination = getPaginationOptions(query);
    const filter: FilterQuery<IJob> = { employer: employerId };
    if (query.status) filter.status = query.status as JobStatus;
    return jobRepository.paginate(filter, pagination);
  }

  async listSkills() {
    return jobRepository.distinctSkills();
  }

  private assertOwnership(job: IJob, userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) return;
    if (job.employer.toString() !== userId) {
      throw ApiError.forbidden('You do not have permission to modify this job');
    }
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const jobService = new JobService();
