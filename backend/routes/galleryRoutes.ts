import express from 'express';
import { createFolder, getFolders, getFolderById, updateFolder, deleteFolder, addImages, removeImage } from '../controllers/galleryController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getFolders);
router.get('/:id', getFolderById);

// Protected routes (Admin/Program Officer/Event Manager only)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'PROGRAM_OFFICER', 'EVENT_MANAGER'), createFolder);
router.put('/:id', authenticate, authorize('SUPER_ADMIN', 'PROGRAM_OFFICER', 'EVENT_MANAGER'), updateFolder);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'PROGRAM_OFFICER', 'EVENT_MANAGER'), deleteFolder);
router.post('/:id/images', authenticate, authorize('SUPER_ADMIN', 'PROGRAM_OFFICER', 'EVENT_MANAGER'), addImages);
router.delete('/:id/images', authenticate, authorize('SUPER_ADMIN', 'PROGRAM_OFFICER', 'EVENT_MANAGER'), removeImage);

export default router;
