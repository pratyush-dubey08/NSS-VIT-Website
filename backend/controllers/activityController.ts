import { Request, Response } from 'express';
import Activity from '../models/Activity';

export const createActivity = async (req: Request, res: Response) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error('Create Activity Error:', error);
    res.status(500).json({ message: 'Error creating activity' });
  }
};

export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate('eventManagers', 'name registrationNumber email department batch').sort({ date: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('eventManagers', 'name registrationNumber email department batch');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity' });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Auth check: If user is EVENT_MANAGER, they must be in the eventManagers list
    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (userRole === 'EVENT_MANAGER' || userRole === 'VOLUNTEER') {
      const isManager = activity.eventManagers.some(m => (m._id || m).toString() === userId);
      if (!isManager) {
        return res.status(403).json({ message: 'You are not authorized to edit this event' });
      }

      // Managers cannot change their own lock status
      if (req.body.isFormLockedForManagers !== undefined) {
        delete req.body.isFormLockedForManagers;
      }

      // If form is locked by admin for managers, block form edits
      if (activity.isFormLockedForManagers) {
        if (req.body.formSchema !== undefined || req.body.formBannerUrl !== undefined) {
          return res.status(403).json({ message: 'Form editing is currently locked by Admin for Event Managers.' });
        }
      }
    }

    const updatedActivity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("eventManagers", "name registrationNumber email department batch");
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: 'Error updating activity' });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity' });
  }
};
