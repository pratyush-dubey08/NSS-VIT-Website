import express from 'express';
import { getVolunteers, addVolunteer, bulkAddVolunteers, updateVolunteer, deleteVolunteer, bulkDeleteVolunteers, updateMyProfile, getPublicVolunteers } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

router.get('/public', getPublicVolunteers);
router.get('/', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), getVolunteers);
router.post('/', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), addVolunteer);
router.post('/bulk', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), bulkAddVolunteers);
router.post('/bulk-delete', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), bulkDeleteVolunteers);
router.put('/me/profile', authenticate, updateMyProfile);
router.put('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), updateVolunteer);
router.delete('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), deleteVolunteer);

export default router;
