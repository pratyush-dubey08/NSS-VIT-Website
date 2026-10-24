import express from 'express';
import {
  getVolunteerForms,
  createVolunteerForm,
  updateVolunteerForm,
  deleteVolunteerForm
} from '../controllers/volunteerFormController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

// Volunteers and guests can view active forms, admins view all
router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    return (authenticate as any)(req, res, next);
  }
  next();
}, getVolunteerForms);

router.post('/', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), createVolunteerForm);
router.put('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), updateVolunteerForm);
router.delete('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), deleteVolunteerForm);

export default router;
