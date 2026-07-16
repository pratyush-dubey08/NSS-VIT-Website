import { Request, Response } from 'express';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import User from '../models/User';

export const bulkUploadCertificates = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No zip file uploaded' });
      return;
    }

    const zipPath = req.file.path;
    const uploadDir = path.join(__dirname, '..', 'uploads');
    
    // Read the zip file
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries(); // an array of ZipEntry records

    let successCount = 0;
    let notFoundCount = 0;
    const missingUsers: string[] = [];

    // Parse each file
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;
      
      const fileName = entry.name;
      // Assume file name format is REGNO.pdf (e.g. 21BCE10101.pdf)
      // Strip out the extension to get the reg no.
      const parsedRegNo = fileName.split('.')[0].toUpperCase().trim();
      
      // Find the user with this registration number
      const user = await User.findOne({ registrationNumber: parsedRegNo });
      
      if (user) {
        // Save the file to the uploads directory
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFileName = uniqueSuffix + '-' + fileName;
        const newFilePath = path.join(uploadDir, newFileName);
        
        fs.writeFileSync(newFilePath, entry.getData());
        
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${newFileName}`;
        
        if (!user.certificates) {
          user.certificates = [];
        }
        user.certificates.push(fileUrl);
        await user.save();
        
        successCount++;
      } else {
        notFoundCount++;
        missingUsers.push(parsedRegNo);
      }
    }

    // Clean up the uploaded zip file
    fs.unlinkSync(zipPath);

    res.status(200).json({ 
      message: 'Bulk upload completed', 
      successCount,
      notFoundCount,
      missingUsers 
    });

  } catch (error) {
    console.error('Bulk Upload Error:', error);
    res.status(500).json({ message: 'Error processing zip file' });
  }
};
