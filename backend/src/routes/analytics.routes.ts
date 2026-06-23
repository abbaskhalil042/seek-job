import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../constants';

const router = Router();

router.use(authenticate);

router.get('/employer', authorize(UserRole.EMPLOYER, UserRole.ADMIN), analyticsController.employerDashboard);
router.get('/seeker', authorize(UserRole.JOB_SEEKER, UserRole.ADMIN), analyticsController.seekerDashboard);
router.get('/admin', authorize(UserRole.ADMIN), analyticsController.adminOverview);

export default router;
