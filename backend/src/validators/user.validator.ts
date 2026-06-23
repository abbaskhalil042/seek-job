import { z } from 'zod';

const seekerProfileSchema = z
  .object({
    headline: z.string().max(160).optional(),
    bio: z.string().max(2000).optional(),
    skills: z.array(z.string()).optional(),
    experienceYears: z.number().min(0).max(60).optional(),
    location: z.string().max(160).optional(),
    phone: z.string().max(40).optional(),
    links: z.array(z.string()).optional(),
  })
  .strict();

const employerProfileSchema = z
  .object({
    companyName: z.string().max(160).optional(),
    companyWebsite: z.string().url().optional().or(z.literal('')),
    companyLogo: z.string().optional(),
    industry: z.string().max(120).optional(),
    companySize: z.string().max(60).optional(),
    about: z.string().max(4000).optional(),
    location: z.string().max(160).optional(),
  })
  .strict();

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    avatar: z.string().optional(),
    seekerProfile: seekerProfileSchema.optional(),
    employerProfile: employerProfileSchema.optional(),
  }),
});
