import { Request, Response } from 'express';
import VolunteerForm from '../models/VolunteerForm';

export const getVolunteerForms = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role;
    let query: any = {};
    if (userRole !== 'SUPER_ADMIN' && userRole !== 'PROGRAM_OFFICER') {
      query.isActive = true;
    }
    const forms = await VolunteerForm.find(query).sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching volunteer forms:', error);
    res.status(500).json({ message: 'Error fetching volunteer forms' });
  }
};

export const createVolunteerForm = async (req: Request, res: Response) => {
  try {
    const {
      title,
      titleBold,
      titleItalic,
      titleUnderline,
      titleColor,
      description,
      descriptionBold,
      descriptionItalic,
      descriptionUnderline,
      descriptionColor,
      googleFormUrl,
      deadline,
      isActive
    } = req.body;

    if (!title || !googleFormUrl) {
      return res.status(400).json({ message: 'Title and Google Form URL are required' });
    }

    const form = new VolunteerForm({
      title,
      titleBold: Boolean(titleBold),
      titleItalic: Boolean(titleItalic),
      titleUnderline: Boolean(titleUnderline),
      titleColor: titleColor || '#111827',
      description: description || '',
      descriptionBold: Boolean(descriptionBold),
      descriptionItalic: Boolean(descriptionItalic),
      descriptionUnderline: Boolean(descriptionUnderline),
      descriptionColor: descriptionColor || '#4b5563',
      googleFormUrl,
      deadline: deadline ? new Date(deadline) : undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating volunteer form:', error);
    res.status(500).json({ message: 'Error creating volunteer form' });
  }
};

export const updateVolunteerForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }

    const updated = await VolunteerForm.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Volunteer form not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating volunteer form:', error);
    res.status(500).json({ message: 'Error updating volunteer form' });
  }
};

export const deleteVolunteerForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await VolunteerForm.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Volunteer form not found' });
    }
    res.status(200).json({ message: 'Volunteer form deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer form:', error);
    res.status(500).json({ message: 'Error deleting volunteer form' });
  }
};
