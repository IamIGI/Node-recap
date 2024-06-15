import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const postFolderPath = path.join(process.cwd(), 'data/products/images');

// Ensure the 'images' directory exists
const ensureDirectoryExistence = (dir: string) => {
  if (!fs.existsSync(dir)) {
    console.log('Creating new folder');
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Ensure the directory exists before configuring Multer
ensureDirectoryExistence(postFolderPath);

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, postFolderPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const fileExtension: string = path.extname(file.originalname);
    const fileName: string = `${uuidv4()}_${fileExtension}`;
    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log('Given file cant be saved');
    cb(null, false);
  }
};

const settings: multer.Options = { storage, fileFilter };

export default {
  settings,
};
