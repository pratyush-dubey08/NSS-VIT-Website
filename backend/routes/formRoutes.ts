import express from 'express';
import { 
  getFormSchemaByActivity, 
  saveFormSchema, 
  submitRegistration, 
  getRegistrationsByActivity, 
  updateRegistrationStatus,
  markAttendance,
  batchMarkAttendance,
  addManualRegistration,
  deleteRegistration,
  getMyRegistrations
} from '../controllers/formController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

// Form Schema
router.get('/schema/:activityId', getFormSchemaByActivity);
router.put('/schema/:activityId', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER]), saveFormSchema);

// Registrations
router.post('/register', authenticate, submitRegistration);
router.post('/registrations/manual', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER, Role.VOLUNTEER]), addManualRegistration);
router.get('/my-registrations', authenticate, getMyRegistrations);
router.get('/registrations/:activityId', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER, Role.VOLUNTEER]), getRegistrationsByActivity);
router.put('/registrations/:registrationId/status', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER, Role.VOLUNTEER]), updateRegistrationStatus);
router.put('/registrations/attendance/batch', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER, Role.VOLUNTEER]), batchMarkAttendance);
router.put('/registrations/:registrationId/attendance', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER, Role.VOLUNTEER]), markAttendance);
router.delete('/registrations/:registrationId', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER, Role.EVENT_MANAGER, Role.VOLUNTEER]), deleteRegistration);

export default router;
