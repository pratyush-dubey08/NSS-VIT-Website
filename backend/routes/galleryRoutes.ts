import express from 'express';
import { createFolder, getFolders, getFolderById, updateFolder, deleteFolder, addImages, removeImage } from '../controllers/galleryController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

// Public routes
router.get('/', getFolders);
router.get('/:id', getFolderById);

// Protected routes (Admin/Program Officer/Event Manager only)
router.post('/', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER]), createFolder);
router.put('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER]), updateFolder);
router.delete('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER]), deleteFolder);
router.post('/:id/images', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER]), addImages);
router.delete('/:id/images', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER]), removeImage);

export default router;
