import { Types } from 'mongoose';
import { applicationRepository } from '../repositories/application.repository';
import { jobRepository } from '../repositories/job.repository';
import { userRepository } from '../repositories/user.repository';
import { resumeRepository } from '../repositories/resume.repository';
import { ApplicationStatus, JobStatus, UserRole } from '../constants';

class AnalyticsService {
  /** Aggregate dashboard metrics for an employer. */
  async employerDashboard(employerId: string) {
    const employerObjId = new Types.ObjectId(employerId);

    const [totalJobs, openJobs, applicationsByStatus, topJobs, recentApplications, totalsAgg] =
      await Promise.all([
        jobRepository.count({ employer: employerId }),
        jobRepository.count({ employer: employerId, status: JobStatus.OPEN }),
        applicationRepository.aggregate<{ _id: ApplicationStatus; count: number }>([
          { $match: { employer: employerObjId } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        applicationRepository.aggregate([
          { $match: { employer: employerObjId } },
          { $group: { _id: '$job', applications: { $sum: 1 }, avgScore: { $avg: '$matchScore' } } },
          { $sort: { applications: -1 } },
          { $limit: 5 },
          {
            $lookup: { from: 'jobs', localField: '_id', foreignField: '_id', as: 'job' },
          },
          { $unwind: '$job' },
          {
            $project: {
              _id: 0,
              jobId: '$_id',
              title: '$job.title',
              slug: '$job.slug',
              applications: 1,
              avgScore: { $round: ['$avgScore', 1] },
              views: '$job.viewCount',
            },
          },
        ]),
        applicationRepository.find(
          { employer: employerObjId },
          { sort: '-createdAt', limit: 5 },
          [
            { path: 'applicant', select: 'name email avatar' },
            { path: 'job', select: 'title slug' },
          ],
        ),
        applicationRepository.aggregate<{ total: number; avgScore: number }>([
          { $match: { employer: employerObjId } },
          { $group: { _id: null, total: { $sum: 1 }, avgScore: { $avg: '$matchScore' } } },
        ]),
      ]);

    return {
      totals: {
        totalJobs,
        openJobs,
        totalApplications: totalsAgg[0]?.total ?? 0,
        avgMatchScore: round(totalsAgg[0]?.avgScore),
      },
      applicationsByStatus: normaliseStatusCounts(applicationsByStatus),
      topJobs,
      recentApplications: recentApplications.map((a) => a.toJSON()),
    };
  }

  /** Aggregate dashboard metrics for a job seeker. */
  async seekerDashboard(seekerId: string) {
    const seekerObjId = new Types.ObjectId(seekerId);

    const [applicationsByStatus, totalsAgg, resumes, recentApplications] = await Promise.all([
      applicationRepository.aggregate<{ _id: ApplicationStatus; count: number }>([
        { $match: { applicant: seekerObjId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      applicationRepository.aggregate<{ total: number; avgScore: number }>([
        { $match: { applicant: seekerObjId } },
        { $group: { _id: null, total: { $sum: 1 }, avgScore: { $avg: '$matchScore' } } },
      ]),
      resumeRepository.count({ owner: seekerId }),
      applicationRepository.find({ applicant: seekerObjId }, { sort: '-createdAt', limit: 5 }, [
        { path: 'job', select: 'title slug companyName location' },
      ]),
    ]);

    return {
      totals: {
        totalApplications: totalsAgg[0]?.total ?? 0,
        avgMatchScore: round(totalsAgg[0]?.avgScore),
        resumes,
      },
      applicationsByStatus: normaliseStatusCounts(applicationsByStatus),
      recentApplications: recentApplications.map((a) => a.toJSON()),
    };
  }

  /** Platform-wide metrics for admins. */
  async adminOverview() {
    const [totalUsers, seekers, employers, totalJobs, openJobs, totalApplications, jobStatusAgg] =
      await Promise.all([
        userRepository.count(),
        userRepository.count({ role: UserRole.JOB_SEEKER }),
        userRepository.count({ role: UserRole.EMPLOYER }),
        jobRepository.count(),
        jobRepository.count({ status: JobStatus.OPEN }),
        applicationRepository.count(),
        jobRepository.aggregate<{ _id: JobStatus; count: number }>([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
      ]);

    return {
      users: { total: totalUsers, seekers, employers },
      jobs: {
        total: totalJobs,
        open: openJobs,
        byStatus: Object.fromEntries(jobStatusAgg.map((j) => [j._id, j.count])),
      },
      applications: { total: totalApplications },
    };
  }
}

function normaliseStatusCounts(rows: { _id: ApplicationStatus; count: number }[]) {
  const base = Object.values(ApplicationStatus).reduce<Record<string, number>>((acc, s) => {
    acc[s] = 0;
    return acc;
  }, {});
  rows.forEach((r) => {
    base[r._id] = r.count;
  });
  return base;
}

function round(n?: number): number {
  return n ? Math.round(n * 10) / 10 : 0;
}

export const analyticsService = new AnalyticsService();
