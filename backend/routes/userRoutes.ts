import express from 'express';
import { getVolunteers, addVolunteer, bulkAddVolunteers, updateVolunteer, deleteVolunteer, bulkDeleteVolunteers, getMyProfile, updateMyProfile, getPublicVolunteers, getVolunteerReport, createChangeRequest, getMyChangeRequests, getAllChangeRequests, updateChangeRequestStatus } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

router.get('/public', getPublicVolunteers);
router.get('/:id/report', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER]), getVolunteerReport);
router.get('/', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), getVolunteers);
router.post('/', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), addVolunteer);
router.post('/bulk', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), bulkAddVolunteers);
router.post('/bulk-delete', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), bulkDeleteVolunteers);
router.get('/me/profile', authenticate, getMyProfile);
router.put('/me/profile', authenticate, updateMyProfile);
router.put('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), updateVolunteer);
router.delete('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), deleteVolunteer);


// Volunteer Profile Correction Request Routes
router.post('/change-request', authenticate, createChangeRequest);
router.get('/change-requests/me', authenticate, getMyChangeRequests);
router.get('/change-requests', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), getAllChangeRequests);
router.put('/change-requests/:id/status', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), updateChangeRequestStatus);

export default router;
