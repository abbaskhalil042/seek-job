import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import jobRoutes from './job.routes';
import resumeRoutes from './resume.routes';
import applicationRoutes from './application.routes';
import analyticsRoutes from './analytics.routes';
import { env } from '../config/env';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    data: {
      status: 'ok',
      uptime: process.uptime(),
      llmEnabled: env.llmEnabled,
      llmProvider: env.LLM_PROVIDER,
    },
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/jobs', jobRoutes);
router.use('/resumes', resumeRoutes);
router.use('/applications', applicationRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
