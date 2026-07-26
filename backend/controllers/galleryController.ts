import { Request, Response } from 'express';
import GalleryFolder from '../models/GalleryFolder';

// Create a new folder
export const createFolder = async (req: Request, res: Response) => {
  try {
    const { title, categoryId, coverImage } = req.body;
    
    if (!title || !categoryId || !coverImage) {
      return res.status(400).json({ message: 'Title, category, and cover image are required.' });
    }

    const folder = new GalleryFolder({
      title,
      categoryId,
      coverImage,
      images: []
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating folder', error });
  }
};

// Get all folders
export const getFolders = async (req: Request, res: Response) => {
  try {
    const folders = await GalleryFolder.find().sort({ createdAt: -1 });
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching folders', error });
  }
};

// Get single folder
export const getFolderById = async (req: Request, res: Response) => {
  try {
    const folder = await GalleryFolder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching folder', error });
  }
};

// Update folder details
export const updateFolder = async (req: Request, res: Response) => {
  try {
    const { title, categoryId, coverImage } = req.body;
    
    const folder = await GalleryFolder.findByIdAndUpdate(
      req.params.id,
      { title, categoryId, coverImage },
      { new: true }
    );
    
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating folder', error });
  }
};

// Delete folder
export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const folder = await GalleryFolder.findByIdAndDelete(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting folder', error });
  }
};

// Add images to folder
export const addImages = async (req: Request, res: Response) => {
  try {
    const { images } = req.body; // array of image URLs
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'Images array is required.' });
    }

    const folder = await GalleryFolder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    folder.images.push(...images);
    await folder.save();

    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error adding images', error });
  }
};

// Remove an image from folder
export const removeImage = async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required.' });
    }

    const folder = await GalleryFolder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    folder.images = folder.images.filter(img => img !== imageUrl);
    await folder.save();

    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error removing image', error });
  }
};
