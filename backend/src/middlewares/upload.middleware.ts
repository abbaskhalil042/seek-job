import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { ALLOWED_RESUME_MIME_TYPES } from '../constants';

const uploadRoot = path.resolve(process.cwd(), env.UPLOAD_DIR);
const resumeDir = path.join(uploadRoot, 'resumes');
fs.mkdirSync(resumeDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, resumeDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, unique);
  },
});

export const uploadResume = multer({
  storage,
  limits: { fileSize: env.maxFileSizeBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    if ((ALLOWED_RESUME_MIME_TYPES as readonly string[]).includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(ApiError.badRequest('Unsupported file type. Upload a PDF, DOCX, DOC, or TXT file.'));
    }
  },
}).single('resume');
