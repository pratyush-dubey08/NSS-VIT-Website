import express from 'express';
import { 
  createActivity, 
  getActivities, 
  getActivityById, 
  updateActivity, 
  deleteActivity 
} from '../controllers/activityController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

// Public routes
router.get('/', getActivities);
router.get('/:id', getActivityById);

// Admin / Program Officer routes
router.post('/', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), createActivity);
router.put('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER]), updateActivity);
router.delete('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), deleteActivity);

export default router;
