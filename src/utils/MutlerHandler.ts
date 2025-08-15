// src/middleware/mutlerHandler.ts
import { Request } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { AWSS3Client } from '../utils/AWSS3Client';

// Custom error interface to help with TypeScript typing
interface MulterError extends Error {
    code: 'LIMIT_FILE_SIZE' | 'LIMIT_FILE_COUNT' | 'LIMIT_PART_COUNT' | 'LIMIT_UNEXPECTED_FILE' | 'LIMIT_FIELD_KEY' | 'LIMIT_FIELD_VALUE' | 'LIMIT_FIELD_COUNT';
}

const bucketName = process.env.S3_BUCKET_NAME;

const imageTypes: string[] = [
  'image/jpeg', 
  'image/jpg',
  'image/png'
];

const documentTypes: string[] = [
  'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const s3Storage = multerS3({
  s3: AWSS3Client,
  bucket: process.env.awsS3BucketName,
  //acl: 'public-read', // Or another ACL, like 'private'
  metadata: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req: Request, file: Express.Multer.File, cb) => {
    // Generate a unique key (file name) for the object in S3
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

export const ImageUploader = multer({
  storage: multerS3({
    s3: AWSS3Client,
    bucket: process.env.awsS3BucketName,
    //acl: 'public-read', // Or other desired ACL
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname); // Unique filename
    },
  }),
  fileFilter: (req, file, cb) => {
    if (imageTypes.some(mimetype => mimetype == file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export const DocumentUploader = multer({
  storage: multerS3({
    s3: AWSS3Client,
    bucket: process.env.awsS3BucketName,
    //acl: 'public-read', // Or other desired ACL
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname); // Unique filename
    },
  }),
  fileFilter: (req, file, cb) => {
    if (documentTypes.some(mimetype => mimetype == file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export const MutlerUpload = multer({
  storage: s3Storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});