import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure uploads directory exists for temporary file handling
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Create multer instance with configuration
export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for large resources and docs
});

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Check if Cloudinary is configured
    const isCloudinaryConfigured = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (isCloudinaryConfigured) {
      try {
        const uploadResult: any = await new Promise((resolve, reject) => {
          const stats = fs.statSync(req.file!.path);
          // Files > 20MB: use upload_large with callback
          if (stats.size > 20 * 1024 * 1024) {
            cloudinary.uploader.upload_large(req.file!.path, {
              folder: 'nss_vit_website',
              resource_type: 'auto',
              chunk_size: 6000000,
            }, (err, res) => {
              if (err) return reject(err);
              resolve(res);
            });
          } else {
            // Files <= 20MB: standard uploader.upload returns a Promise
            cloudinary.uploader.upload(req.file!.path, {
              folder: 'nss_vit_website',
              resource_type: 'auto',
            })
            .then(resolve)
            .catch(reject);
          }
        });

        // Delete temporary local file after successful upload to Cloudinary
        fs.unlink(req.file.path, () => {});

        const finalUrl = uploadResult?.secure_url || uploadResult?.url;

        if (finalUrl) {
          res.status(200).json({
            message: 'File uploaded successfully',
            url: finalUrl,
            fileUrl: finalUrl,
            filename: uploadResult?.public_id || req.file.filename,
          });
          return;
        }
      } catch (cloudErr) {
        console.error('Cloudinary upload error, falling back to local disk:', cloudErr);
      }
    }

    // Local fallback
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = process.env.BACKEND_URL || (protocol + '://' + host);
    const fileUrl = baseUrl + '/uploads/' + req.file.filename;

    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      fileUrl: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};
