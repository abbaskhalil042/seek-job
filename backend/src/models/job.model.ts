import { Schema, model, Document, Types } from 'mongoose';
import {
  ExperienceLevel,
  JobStatus,
  JobType,
  WorkMode,
} from '../constants';

export interface ISalaryRange {
  min?: number;
  max?: number;
  currency: string;
  period: 'hour' | 'month' | 'year';
}

export interface IJob extends Document {
  _id: Types.ObjectId;
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
  salary?: ISalaryRange;
  status: JobStatus;
  employer: Types.ObjectId; // ref User (employer)
  companyName?: string;
  applicationCount: number;
  viewCount: number;
  openings: number;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const salarySchema = new Schema<ISalaryRange>(
  {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['hour', 'month', 'year'], default: 'year' },
  },
  { _id: false },
);

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [], index: true },
    jobType: { type: String, enum: Object.values(JobType), required: true },
    workMode: { type: String, enum: Object.values(WorkMode), required: true },
    experienceLevel: {
      type: String,
      enum: Object.values(ExperienceLevel),
      required: true,
    },
    location: String,
    salary: { type: salarySchema, default: undefined },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
      index: true,
    },
    employer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: String,
    applicationCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    openings: { type: Number, default: 1, min: 1 },
    deadline: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (_d, ret) => (delete ret.__v, ret) },
  },
);

// Full-text search across the most relevant fields.
jobSchema.index({ title: 'text', description: 'text', skills: 'text', companyName: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });

export const Job = model<IJob>('Job', jobSchema);
