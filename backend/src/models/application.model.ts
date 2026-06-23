import { Schema, model, Document, Types } from 'mongoose';
import { ApplicationStatus } from '../constants';

export interface IApplicationTimeline {
  status: ApplicationStatus;
  note?: string;
  at: Date;
  by?: Types.ObjectId;
}

export interface IApplication extends Document {
  _id: Types.ObjectId;
  job: Types.ObjectId; // ref Job
  applicant: Types.ObjectId; // ref User (job_seeker)
  employer: Types.ObjectId; // denormalised for fast employer queries
  resume: Types.ObjectId; // ref Resume snapshot used
  coverLetter?: string;
  status: ApplicationStatus;
  /** AI-computed match score (0-100) between resume and job. */
  matchScore?: number;
  matchInsights?: {
    matchedSkills: string[];
    missingSkills: string[];
    summary?: string;
  };
  timeline: IApplicationTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const timelineSchema = new Schema<IApplicationTimeline>(
  {
    status: { type: String, enum: Object.values(ApplicationStatus), required: true },
    note: String,
    at: { type: Date, default: Date.now },
    by: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false },
);

const applicationSchema = new Schema<IApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    employer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    coverLetter: String,
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
      index: true,
    },
    matchScore: { type: Number, min: 0, max: 100 },
    matchInsights: {
      matchedSkills: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
      summary: String,
    },
    timeline: { type: [timelineSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (_d, ret) => (delete ret.__v, ret) },
  },
);

// A seeker can only apply once per job.
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = model<IApplication>('Application', applicationSchema);
