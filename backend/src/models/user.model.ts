import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../constants';

/** Job-seeker specific profile sub-document. */
export interface ISeekerProfile {
  headline?: string;
  bio?: string;
  skills: string[];
  experienceYears?: number;
  location?: string;
  phone?: string;
  links?: string[];
  /** Currently active resume (link to Resume collection). */
  activeResume?: Types.ObjectId;
}

/** Employer specific profile sub-document. */
export interface IEmployerProfile {
  companyName?: string;
  companyWebsite?: string;
  companyLogo?: string;
  industry?: string;
  companySize?: string;
  about?: string;
  location?: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  emailVerified: boolean;
  seekerProfile?: ISeekerProfile;
  employerProfile?: IEmployerProfile;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const seekerProfileSchema = new Schema<ISeekerProfile>(
  {
    headline: String,
    bio: String,
    skills: { type: [String], default: [] },
    experienceYears: Number,
    location: String,
    phone: String,
    links: { type: [String], default: [] },
    activeResume: { type: Schema.Types.ObjectId, ref: 'Resume' },
  },
  { _id: false },
);

const employerProfileSchema = new Schema<IEmployerProfile>(
  {
    companyName: String,
    companyWebsite: String,
    companyLogo: String,
    industry: String,
    companySize: String,
    about: String,
    location: String,
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false, minlength: 8 },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.JOB_SEEKER,
      index: true,
    },
    avatar: String,
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    seekerProfile: { type: seekerProfileSchema, default: undefined },
    employerProfile: { type: employerProfileSchema, default: undefined },
    refreshTokens: { type: [String], default: [], select: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.refreshTokens;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>('User', userSchema);
