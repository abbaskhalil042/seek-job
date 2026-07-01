/**
 * Domain types shared across the app. These mirror the backend contracts
 * (see backend/src/constants & models). Keep them in sync with the API.
 */

export type UserRole = "job_seeker" | "employer" | "admin";

export type JobType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "temporary";

export type WorkMode = "onsite" | "remote" | "hybrid";

export type ExperienceLevel = "entry" | "junior" | "mid" | "senior" | "lead";

export type JobStatus = "draft" | "open" | "closed" | "archived";

export type ApplicationStatus =
  | "applied"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "offered"
  | "rejected"
  | "withdrawn"
  | "hired";

export type ResumeParseStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface SeekerProfile {
  headline?: string;
  bio?: string;
  skills: string[];
  experienceYears?: number;
  location?: string;
  phone?: string;
  links?: string[];
  activeResume?: string;
}

export interface EmployerProfile {
  companyName?: string;
  companyWebsite?: string;
  companyLogo?: string;
  industry?: string;
  companySize?: string;
  about?: string;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  seekerProfile?: SeekerProfile;
  employerProfile?: EmployerProfile;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryRange {
  min?: number;
  max?: number;
  currency: string;
  period: "hour" | "month" | "year";
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  location?: string;
  salary?: SalaryRange;
  status: JobStatus;
  employer: string | Pick<User, "id" | "name" | "avatar" | "employerProfile">;
  companyName?: string;
  applicationCount: number;
  viewCount: number;
  openings: number;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResume {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  totalExperienceYears?: number;
  education: {
    degree?: string;
    institution?: string;
    field?: string;
    startYear?: string;
    endYear?: string;
  }[];
  experience: {
    title?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  certifications: string[];
  languages: string[];
  links: string[];
}

export interface Resume {
  id: string;
  owner: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  parseStatus: ResumeParseStatus;
  parseError?: string;
  parsedBy?: "llm" | "heuristic";
  parsed?: ParsedResume;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationTimelineEvent {
  status: ApplicationStatus;
  note?: string;
  at: string;
  by?: string;
}

export interface Application {
  id: string;
  job: string | Pick<Job, "id" | "title" | "slug" | "companyName" | "location" | "jobType" | "workMode" | "status">;
  applicant: string | Pick<User, "id" | "name" | "email" | "avatar" | "seekerProfile">;
  employer: string;
  resume: string | Pick<Resume, "id" | "originalName" | "parsed" | "parseStatus" | "parsedBy">;
  coverLetter?: string;
  status: ApplicationStatus;
  matchScore?: number;
  matchInsights?: {
    matchedSkills: string[];
    missingSkills: string[];
    summary?: string;
  };
  timeline: ApplicationTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------- API envelopes ------------------------------ */

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
}

export interface ApiErrorBody {
  success: false;
  message: string;
  details?: unknown;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/* ------------------------------ Analytics shapes ---------------------------- */

export interface StatusCounts {
  [status: string]: number;
}

export interface EmployerDashboard {
  totals: {
    totalJobs: number;
    openJobs: number;
    totalApplications: number;
    avgMatchScore: number;
  };
  applicationsByStatus: StatusCounts;
  topJobs: {
    jobId: string;
    title: string;
    slug: string;
    applications: number;
    avgScore: number;
    views: number;
  }[];
  recentApplications: Application[];
}

export interface SeekerDashboard {
  totals: {
    totalApplications: number;
    avgMatchScore: number;
    resumes: number;
  };
  applicationsByStatus: StatusCounts;
  recentApplications: Application[];
}
