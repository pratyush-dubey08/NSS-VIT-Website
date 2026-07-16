import express from 'express';
import { upload, uploadFile } from '../controllers/uploadController';
import { bulkUploadCertificates } from '../controllers/certificateController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

// Allow authenticated users to upload single files
router.post('/', authenticate, upload.single('file'), uploadFile);

// Allow admins to upload bulk zip files
router.post('/bulk-certificates', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER]), upload.single('zipFile'), bulkUploadCertificates);

export default router;
