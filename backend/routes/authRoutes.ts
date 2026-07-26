import express from 'express';
import { loginUser, changeAdminPassword, googleLoginUser } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

router.post('/login', loginUser);
router.post('/google', googleLoginUser);
router.put('/password', authenticate, authorize([Role.SUPER_ADMIN]), changeAdminPassword);

export default router;
