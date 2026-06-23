import { z } from 'zod';
import { UserRole } from '../constants';

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(120),
      email: z.string().email(),
      password: z.string().min(8).max(128),
      role: z.nativeEnum(UserRole).optional(),
      companyName: z.string().min(1).max(160).optional(),
    })
    .refine((d) => d.role !== UserRole.EMPLOYER || !!d.companyName, {
      message: 'companyName is required for employer accounts',
      path: ['companyName'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10).optional(),
  }),
});
