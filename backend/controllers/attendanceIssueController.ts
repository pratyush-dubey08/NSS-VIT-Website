import { Request, Response } from 'express';
import AttendanceIssue from '../models/AttendanceIssue';
import Registration from '../models/Registration';
import Activity from '../models/Activity';
import User from '../models/User';

export const raiseAttendanceIssue = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { activityId, issueType, description } = req.body;

    if (!activityId || !issueType || !description) {
      return res.status(400).json({ message: 'Activity, issue type, and description are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const activity = await Activity.findById(activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    // Check if issue already pending for this activity by this volunteer
    const existing = await AttendanceIssue.findOne({
      userId,
      activityId,
      status: 'PENDING'
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have a pending attendance issue for this activity.' });
    }

    const newIssue = new AttendanceIssue({
      userId,
      activityId,
      volunteerName: user.name,
      registrationNumber: user.registrationNumber || '-',
      email: user.email,
      batch: user.batch || '',
      issueType,
      description: description.trim()
    });

    await newIssue.save();
    res.status(201).json({ message: 'Attendance issue reported successfully', data: newIssue });
  } catch (error) {
    console.error('Error raising attendance issue:', error);
    res.status(500).json({ message: 'Error reporting attendance issue' });
  }
};

export const getMyAttendanceIssues = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const issues = await AttendanceIssue.find({ userId })
      .populate('activityId', 'title date venue hoursAllocated')
      .sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    console.error('Error fetching my issues:', error);
    res.status(500).json({ message: 'Error fetching your issues' });
  }
};

export const getAllAttendanceIssues = async (req: Request, res: Response) => {
  try {
    const issues = await AttendanceIssue.find()
      .populate('activityId', 'title date venue hoursAllocated')
      .sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    console.error('Error fetching all issues:', error);
    res.status(500).json({ message: 'Error fetching attendance issues' });
  }
};

export const updateAttendanceIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks, autoMarkPresent } = req.body;

    const issue = await AttendanceIssue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (status) issue.status = status;
    if (adminRemarks !== undefined) issue.adminRemarks = adminRemarks;

    await issue.save();

    // If admin resolves issue and requests autoMarkPresent (or resolving MARKED_ABSENT/NOT_MARKED)
    if (status === 'RESOLVED' && autoMarkPresent) {
      const registration = await Registration.findOne({
        activityId: issue.activityId,
        userId: issue.userId
      });

      if (registration && registration.attendanceStatus !== 'ATTENDED') {
        const previousStatus = registration.attendanceStatus;
        registration.attendanceStatus = 'ATTENDED';
        await registration.save();

        const activity = await Activity.findById(issue.activityId);
        const user = await User.findById(issue.userId);

        if (activity && user) {
          const actHours = activity.hoursAllocated || 0;
          if (previousStatus === 'BUNKED') {
            user.bunks = Math.max(0, (user.bunks || 0) - 1);
          }
          user.accumulatedHours = (user.accumulatedHours || 0) + actHours;
          await user.save();
        }
      }
    }

    res.status(200).json({ message: 'Issue updated successfully', data: issue });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ message: 'Error updating attendance issue' });
  }
};

export const deleteAttendanceIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await AttendanceIssue.findByIdAndDelete(id);
    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ message: 'Error deleting attendance issue' });
  }
};
