import { Router } from 'express';
import * as applicationController from '../controllers/application.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { UserRole } from '../constants';
import {
  applicationIdParamSchema,
  applySchema,
  updateApplicationStatusSchema,
} from '../validators/application.validator';

const router = Router();

router.use(authenticate);

// Seeker actions
router.post('/', authorize(UserRole.JOB_SEEKER), validate(applySchema), applicationController.apply);
router.get('/me', authorize(UserRole.JOB_SEEKER), applicationController.myApplications);
router.patch(
  '/:id/withdraw',
  authorize(UserRole.JOB_SEEKER),
  validate(applicationIdParamSchema),
  applicationController.withdrawApplication,
);

// Shared / employer actions
router.get('/:id', validate(applicationIdParamSchema), applicationController.getApplication);
router.patch(
  '/:id/status',
  authorize(UserRole.EMPLOYER, UserRole.ADMIN),
  validate(updateApplicationStatusSchema),
  applicationController.updateApplicationStatus,
);

export default router;
