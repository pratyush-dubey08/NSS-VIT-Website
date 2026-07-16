import { Request, Response } from 'express';
import Resource from '../models/Resource';

export const getResources = async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const { title, category, fileUrl } = req.body;
    
    if (!title || !fileUrl) {
      return res.status(400).json({ message: 'Title and fileUrl are required' });
    }

    const resource = new Resource({
      title,
      category: category || 'document',
      fileUrl
    });

    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ message: 'Error creating resource' });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Error deleting resource' });
  }
};
