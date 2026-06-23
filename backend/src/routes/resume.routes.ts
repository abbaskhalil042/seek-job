import { Router } from 'express';
import * as resumeController from '../controllers/resume.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { uploadResume } from '../middlewares/upload.middleware';
import { validate } from '../middlewares/validate.middleware';
import { UserRole } from '../constants';
import { z } from 'zod';

const idParam = z.object({ params: z.object({ id: z.string().length(24) }) });

const router = Router();

// Resumes belong to job seekers.
router.use(authenticate, authorize(UserRole.JOB_SEEKER, UserRole.ADMIN));

router.post('/', uploadResume, resumeController.uploadResume);
router.get('/', resumeController.listMyResumes);
router.get('/:id', validate(idParam), resumeController.getResume);
router.post('/:id/reparse', validate(idParam), resumeController.reparseResume);
router.patch('/:id/primary', validate(idParam), resumeController.setPrimaryResume);
router.delete('/:id', validate(idParam), resumeController.deleteResume);

export default router;
