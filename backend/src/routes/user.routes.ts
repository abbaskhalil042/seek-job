import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getMyProfile);
router.patch('/me', validate(updateProfileSchema), userController.updateMyProfile);
router.delete('/me', userController.deactivateMyAccount);
router.get('/:id', userController.getUserById);

export default router;
