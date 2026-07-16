import express from 'express';
import { getResources, createResource, deleteResource } from '../controllers/resourceController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

// Public route for viewing resources (used by volunteer dashboard)
router.get('/', getResources);

// Admin routes for managing resources
router.post('/', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), createResource);
router.delete('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), deleteResource);

export default router;
