/* eslint-disable no-console */
import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/user.model';
import { Job } from '../models/job.model';
import { Application } from '../models/application.model';
import { Resume } from '../models/resume.model';
import {
  ApplicationStatus,
  ExperienceLevel,
  JobStatus,
  JobType,
  UserRole,
  WorkMode,
} from '../constants';
import { uniqueSlug } from '../utils/slug';

/**
 * Idempotent-ish seed: wipes the core collections and recreates a small,
 * realistic dataset (admin + employer + seeker + jobs + an application).
 * Run with: `npm run seed`
 */
async function seed() {
  await connectDB();
  console.log('🌱 Seeding database...');

  await Promise.all([
    User.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Resume.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Platform Admin',
    email: 'admin@seekjob.dev',
    password: 'Admin@12345',
    role: UserRole.ADMIN,
    emailVerified: true,
  });

  const employer = await User.create({
    name: 'Rohit Jha',
    email: 'employer@seekjob.dev',
    password: 'Employer@12345',
    role: UserRole.EMPLOYER,
    emailVerified: true,
    employerProfile: {
      companyName: 'Elements HR Services',
      industry: 'Human Resources',
      companySize: '51-200',
      location: 'Gurgaon, India',
      about: 'Connecting great companies with great talent.',
    },
  });

  const seeker = await User.create({
    name: 'Abbas Khalil',
    email: 'seeker@seekjob.dev',
    password: 'Seeker@12345',
    role: UserRole.JOB_SEEKER,
    emailVerified: true,
    seekerProfile: {
      headline: 'Full-Stack Engineer',
      skills: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Next.js'],
      experienceYears: 4,
      location: 'Gurgaon, India',
    },
  });

  const jobsData = [
    {
      title: 'Senior Full-Stack Engineer (MERN)',
      description:
        'We are looking for a senior full-stack engineer experienced with the MERN stack to build and scale our job portal platform with resume parsing and analytics.',
      responsibilities: ['Design APIs', 'Build React UIs', 'Own features end to end'],
      requirements: ['5+ years experience', 'Strong TypeScript', 'MongoDB expertise'],
      skills: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Next.js'],
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      experienceLevel: ExperienceLevel.SENIOR,
      location: 'Gurgaon, India',
      salary: { min: 2000000, max: 3500000, currency: 'INR', period: 'year' as const },
    },
    {
      title: 'Frontend Engineer (React / Next.js)',
      description:
        'Join our team to craft delightful, accessible interfaces using React, Next.js and shadcn/ui.',
      responsibilities: ['Implement designs', 'Optimise performance'],
      requirements: ['2+ years React', 'CSS mastery'],
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'shadcn'],
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.MID,
      location: 'Remote',
      salary: { min: 1200000, max: 2000000, currency: 'INR', period: 'year' as const },
    },
    {
      title: 'Backend Engineer (Node.js)',
      description: 'Build robust, well-tested REST APIs with Node.js, Express and MongoDB.',
      responsibilities: ['Design schemas', 'Write APIs', 'Add tests'],
      requirements: ['3+ years backend', 'REST design'],
      skills: ['Node.js', 'Express', 'MongoDB', 'TypeScript', 'Docker'],
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.ONSITE,
      experienceLevel: ExperienceLevel.MID,
      location: 'Gurgaon, India',
    },
  ];

  const jobs = await Job.create(
    jobsData.map((j) => ({
      ...j,
      slug: uniqueSlug(j.title),
      employer: employer._id,
      companyName: employer.employerProfile?.companyName,
      status: JobStatus.OPEN,
    })),
  );

  // A resume + application for the seeker against the first job.
  const resume = await Resume.create({
    owner: seeker._id,
    originalName: 'abbas-khalil-resume.pdf',
    storedName: 'seed-resume.pdf',
    filePath: 'uploads/resumes/seed-resume.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 12345,
    parseStatus: 'completed',
    parsedBy: 'heuristic',
    isPrimary: true,
    parsed: {
      fullName: 'Abbas Khalil',
      email: 'seeker@seekjob.dev',
      skills: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Next.js'],
      totalExperienceYears: 4,
      education: [],
      experience: [],
      certifications: [],
      languages: ['English'],
      links: [],
    },
  });

  seeker.seekerProfile!.activeResume = resume._id;
  await seeker.save();

  await Application.create({
    job: jobs[0]._id,
    applicant: seeker._id,
    employer: employer._id,
    resume: resume._id,
    coverLetter: 'I am excited to apply for this role.',
    status: ApplicationStatus.APPLIED,
    matchScore: 100,
    matchInsights: {
      matchedSkills: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Next.js'],
      missingSkills: [],
      summary: 'Matched 6/6 required skills.',
    },
    timeline: [{ status: ApplicationStatus.APPLIED, at: new Date() }],
  });
  await Job.findByIdAndUpdate(jobs[0]._id, { $inc: { applicationCount: 1 } });

  console.log('✅ Seed complete!');
  console.log('   Admin    : admin@seekjob.dev / Admin@12345');
  console.log('   Employer : employer@seekjob.dev / Employer@12345');
  console.log('   Seeker   : seeker@seekjob.dev / Seeker@12345');

  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
