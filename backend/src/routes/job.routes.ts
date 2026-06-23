import { Router } from 'express';
import * as jobController from '../controllers/job.controller';
import * as applicationController from '../controllers/application.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { UserRole } from '../constants';
import {
  createJobSchema,
  jobIdParamSchema,
  jobSlugParamSchema,
  updateJobSchema,
  updateJobStatusSchema,
} from '../validators/job.validator';

const router = Router();

// --- Public ---
router.get('/', jobController.searchJobs);
router.get('/skills', jobController.listJobSkills);
router.get('/slug/:slug', validate(jobSlugParamSchema), jobController.getJobBySlug);

// --- Employer dashboard (must precede '/:id') ---
router.get('/me/list', authenticate, authorize(UserRole.EMPLOYER, UserRole.ADMIN), jobController.listMyJobs);

router.get('/:id', validate(jobIdParamSchema), jobController.getJobById);

// Applications for a job (employer/admin only).
router.get(
  '/:jobId/applications',
  authenticate,
  authorize(UserRole.EMPLOYER, UserRole.ADMIN),
  applicationController.jobApplications,
);

// --- Employer CRUD ---
router.post(
  '/',
  authenticate,
  authorize(UserRole.EMPLOYER, UserRole.ADMIN),
  validate(createJobSchema),
  jobController.createJob,
);
router.patch(
  '/:id',
  authenticate,
  authorize(UserRole.EMPLOYER, UserRole.ADMIN),
  validate(updateJobSchema),
  jobController.updateJob,
);
router.patch(
  '/:id/status',
  authenticate,
  authorize(UserRole.EMPLOYER, UserRole.ADMIN),
  validate(updateJobStatusSchema),
  jobController.updateJobStatus,
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.EMPLOYER, UserRole.ADMIN),
  validate(jobIdParamSchema),
  jobController.deleteJob,
);

export default router;
