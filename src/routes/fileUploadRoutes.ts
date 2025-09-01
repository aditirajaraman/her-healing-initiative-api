/*-----------------------------------imports----------------------------------------*/
import { Router, Request, Response } from "express";
import path from 'path';
import multer from 'multer'; 
import fs from 'fs/promises';

/*-----------------------------------imports / Custom -------------------------------*/
import config from '../config/config';
import { UniqueIdGenerator } from '../utils/UniqueIDGenerator';

const rootAppDir = config.MUTLER_UPLOADS_DIR;

//console.log("-----------------file Paths-----------------");
//console.log(rootAppDir);

/*-------------------------Custom Interfaces/Properties/ Functions ------------------*/

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only! (jpeg, jpg, png, gif)');
  }
}

const storage = multer.diskStorage({
    destination: rootAppDir, // Folder where files will be saved
    filename: (req, file, cb) => {
        // Customize filename (e.g., add timestamp to prevent collisions)
        //console.log('--------storage filename----------');
        //console.log(file.fieldname);
        //console.log(file.originalname);
        //console.log(file.filename);
        //cb(null, req.body.blogId + '_' + req.body.uiAction + '_' + Date.now() + path.extname(file.originalname));
        cb(null, file.originalname);
    }
});

// Set up a temporary storage location for multer
// We'll rename and move the file later
const upload = multer({ 
  dest: 'uploads/temp',
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }  
})

const uploadDelete = multer({ 
  dest: 'uploads/imanges'  
})

// Ensure the temporary directory exists
//const tempDir = path.join(rootAppDir, '/uploads/temp');
//if (!fs.existsSync(tempDir)) {
//  fs.mkdirSync(tempDir, { recursive: true });
//}

async function ensureTempDirExists() {
  const tempDir = path.join(rootAppDir, '/uploads/temp');

  try {
    await fs.stat(tempDir);
    //console.log('Temporary directory already exists.');
  } catch (error: unknown) { // Use `unknown` or let TypeScript infer it
    // Check if the error object has a 'code' property and if it's the one we expect.
    // This is the type guard.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'ENOENT'
    ) {
      // Directory does not exist, so create it
      await fs.mkdir(tempDir, { recursive: true });
      //console.log('Temporary directory created successfully.');
    } else {
      // It's a different kind of error, so we throw it or log it
      console.error('Error checking or creating temporary directory:', error);
    }
  }
}

/*----------------------------------------------------routes------------------------------------*/
const fileUploadRoutes = Router();

// File Upload
fileUploadRoutes.post("/fileUpload/uploadBlogImage", upload.single('blogImage'), (req: Request, res: Response) => {
  if (req.file) {
      //console.log('File uploaded:', req.file.filename);
      res.status(200).send('File uploaded successfully!');
  } else {
      res.status(400).send('No file uploaded.');
  }
});

/*fileUploadRoutes.post("/fileUpload/uploadBlogContentImage", upload.single('UploadFiles'), (req: Request, res: Response) => {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      res.status(400).json({ error: 'No file uploaded.' });
    }

    // Now req.body is fully populated and accessible
    //const userId = req.body.userId || 'default-user';

    const uiAction = req.body.uiAction;
    const userId = req.body.userId;
    const blogId = req.body.blogId;
    const targetFileName = req.body.targetFileName;

    // Create a new, unique filename
    const newFileName = `${targetFileName}`;
    //console.log("-----------newFileName------------");
    //console.log(newFileName);

    // Define the destination path for the final file
    const finalDir = path.join(rootAppDir, './uploads/images');
    //console.log("-----------finalDir------------");
    //console.log(finalDir);
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }
    const finalFilePath = path.join(finalDir, newFileName);

    // Move the file from the temporary location to the final destination
    fs.renameSync(uploadedFile.path, finalFilePath);

    //console.log(`File renamed and moved: ${uploadedFile.path} -> ${finalFilePath}`);

    // Construct the URL to access the image.
    const imageUrl = `/uploads/images/${newFileName}`;

    // Send the response with the new image URL
    res.json({
      files: [
        {
          name: newFileName,
          url: imageUrl
        }
      ]
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
})*/

fileUploadRoutes.post("/fileUpload/uploadBlogContentImage", upload.single('UploadFiles'), async (req: Request, res: Response) => {
    try {
      const uploadedFile = req.file;

      if (!uploadedFile) {
        res.status(400).json({ error: 'No file uploaded.' });
      }

      // Security Fix: Generate a safe filename to prevent Path Traversal
      const originalExtension = path.extname(uploadedFile.originalname);
      const uniqueIdGenerator = new UniqueIdGenerator(); 
      const newFileName = `${uniqueIdGenerator.getUniqueId()}${originalExtension}`;

      // Define the destination path
      const finalDir = path.join(rootAppDir, './uploads/images');

      // Use the async 'access' method to check if the directory exists.
      // It will throw an error if the directory doesn't exist.
      try {
        await fs.access(finalDir);
      } catch (error: any) {
        // If the directory does not exist (ENOENT), create it.
        if (error.code === 'ENOENT') {
          await fs.mkdir(finalDir, { recursive: true });
        } else {
          // If it's a different error (e.g., permissions), re-throw it.
          throw error;
        }
      }
      
      const finalFilePath = path.join(finalDir, newFileName);

      // Use the async 'rename' method to move the file
      await fs.rename(uploadedFile.path, finalFilePath);

      //console.log(`File renamed and moved: ${uploadedFile.path} -> ${finalFilePath}`);

      // Construct the URL to access the image.
      const imageUrl = `/uploads/images/${newFileName}`;

      // Send the response with the new image URL
      res.json({
        files: [
          {
            name: newFileName,
            url: imageUrl
          }
        ]
      });

    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
});


// File Delete Content Imange
/*
fileUploadRoutes.post("/fileUpload/deleteBlogContentImage", uploadDelete.single('UploadFiles'), (req: Request, res: Response) => {
  console.log('----------------file Removing-----------------')
  //console.log(req.body);
  const filename = `blogContentImage_${req.body.blogId}_${req.body.targetFileName}`;
  //console.log(filename);

  if (!filename) {
    res.status(400).json({ error: 'Filename is required.' });
  }

  // Construct the absolute path to the file
  var finalPath = `${rootAppDir}\\uploads\\images`;
  const filePath = path.join(finalPath, filename);

  // ‼️ SECURITY CHECK ‼️
  // Ensure the resolved path is still within the uploads directory
  if (!filePath.startsWith(rootAppDir)) {
    res.status(403).json({ error: 'Forbidden: Invalid path.' });
  }

  // Use fs.unlink to delete the file
  fs.unlink(filePath, (err) => {
      if (err) {
          // Common error: file not found
          if (err.code === 'ENOENT') {
              res.status(404).json({ error: 'File not found.' });
          }
          else{
            // Other server errors
            console.error('Error deleting file:', err);
            res.status(500).json({ error: 'Error deleting the file.' });
          }
      }
      else{
        //console.log(`Successfully deleted: ${filename}`);
        res.status(200).json({ message: 'File deleted successfully.' });
      }
  });
});
*/

// Note: No multer middleware needed for this route
fileUploadRoutes.post("/fileUpload/deleteBlogContentImage", async (req: Request, res: Response) => {
  try {
    const { blogId, targetFileName } = req.body;

    // Validate required fields
    if (!blogId || !targetFileName) {
      res.status(400).json({ error: 'blogId and targetFileName are required.' });
    }

    // Construct the filename based on the predictable pattern
    const filename = `blogContentImage_${blogId}_${targetFileName}`;

    // Construct the absolute path to the file
    const uploadDir = path.join(rootAppDir, 'uploads', 'images');
    const filePath = path.join(uploadDir, filename);

    // ‼️ SECURITY CHECK ‼️
    // Ensure the file is within the designated upload directory to prevent path traversal
    const resolvedUploadDir = path.resolve(uploadDir);
    const resolvedFilePath = path.resolve(filePath);

    // This check is more robust and handles different OS path separators and casings
    if (!resolvedFilePath.startsWith(resolvedUploadDir + path.sep)) {
      res.status(403).json({ error: 'Forbidden: Invalid path.' });
    }

    // Use fs.promises.unlink to delete the file asynchronously
    await fs.unlink(filePath);

    //console.log(`Successfully deleted: ${filename}`);
    res.status(200).json({ message: 'File deleted successfully.' });

  } catch (error: unknown) {
    // Check for the "file not found" error specifically
    if ((error as any).code === 'ENOENT') {
      res.status(404).json({ error: 'File not found.' });
    }
    
    // Other server errors
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default fileUploadRoutes;