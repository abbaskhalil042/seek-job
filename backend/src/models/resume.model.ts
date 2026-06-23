import { Schema, model, Document, Types } from 'mongoose';
import { ResumeParseStatus } from '../constants';

export interface IResume extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId; // ref User (job_seeker)
  originalName: string;
  storedName: string;
  filePath: string;
  mimeType: string;
  sizeBytes: number;
  /** Raw extracted text (kept for re-parsing / matching). */
  rawText?: string;
  parseStatus: ResumeParseStatus;
  parseError?: string;
  /** Whether parsing used the LLM or the heuristic fallback. */
  parsedBy?: 'llm' | 'heuristic';
  parsed?: {
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
  };
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    rawText: { type: String, select: false },
    parseStatus: {
      type: String,
      enum: Object.values(ResumeParseStatus),
      default: ResumeParseStatus.PENDING,
      index: true,
    },
    parseError: String,
    parsedBy: { type: String, enum: ['llm', 'heuristic'] },
    parsed: {
      type: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
        summary: String,
        skills: { type: [String], default: [] },
        totalExperienceYears: Number,
        education: { type: Array, default: [] },
        experience: { type: Array, default: [] },
        certifications: { type: [String], default: [] },
        languages: { type: [String], default: [] },
        links: { type: [String], default: [] },
      },
      default: undefined,
    },
    isPrimary: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (_d, ret) => (delete ret.__v, ret) },
  },
);

export const Resume = model<IResume>('Resume', resumeSchema);
