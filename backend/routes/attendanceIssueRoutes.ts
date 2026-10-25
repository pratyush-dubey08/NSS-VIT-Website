import express from 'express';
import {
  raiseAttendanceIssue,
  getMyAttendanceIssues,
  getAllAttendanceIssues,
  updateAttendanceIssue,
  deleteAttendanceIssue
} from '../controllers/attendanceIssueController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { Role } from '../models/User';

const router = express.Router();

router.post('/', authenticate, raiseAttendanceIssue);
router.get('/my', authenticate, getMyAttendanceIssues);

router.get('/', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), getAllAttendanceIssues);
router.put('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), updateAttendanceIssue);
router.delete('/:id', authenticate, authorize([Role.SUPER_ADMIN, Role.PROGRAM_OFFICER]), deleteAttendanceIssue);

export default router;
