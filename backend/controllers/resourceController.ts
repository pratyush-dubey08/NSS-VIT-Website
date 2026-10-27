import { Request, Response } from 'express';
import Resource from '../models/Resource';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

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
    let { title, category, fileUrl } = req.body;

    // If file uploaded directly via multipart form
    if (req.file) {
      const isCloudinaryConfigured = Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      );

      if (isCloudinaryConfigured) {
        try {
          const result = await cloudinary.uploader.upload_large(req.file.path, {
            folder: 'nss_vit_resources',
            resource_type: 'auto',
            chunk_size: 6000000,
          });
          fileUrl = (result as any)?.secure_url;
          fs.unlink(req.file.path, () => {});
        } catch (cloudErr) {
          console.error('Cloudinary upload error in createResource, falling back to local disk:', cloudErr);
          const protocol = req.headers['x-forwarded-proto'] || req.protocol;
          const host = req.headers['x-forwarded-host'] || req.get('host');
          const baseUrl = process.env.BACKEND_URL || (protocol + '://' + host);
          fileUrl = baseUrl + '/uploads/' + req.file.filename;
        }
      } else {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        const baseUrl = process.env.BACKEND_URL || (protocol + '://' + host);
        fileUrl = baseUrl + '/uploads/' + req.file.filename;
      }
    }
    
    if (!title || !fileUrl) {
      return res.status(400).json({ message: 'Title and fileUrl or uploaded file are required' });
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
