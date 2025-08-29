import { Router, Request, Response } from "express";
//import { useParams } from 'react-router-dom';
var path = require('path');
const fs = require('fs');
import { format, parse } from 'date-fns';

// Setup mutler
import multer from 'multer'; 

const fileUploadRoutes = Router();

const appEntryFile = require.main.filename;
const appFolderName = path.dirname(appEntryFile);
const rootAppDir = path.join(appFolderName, '..');

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
    destination: appFolderName, // Folder where files will be saved
    filename: (req, file, cb) => {
        // Customize filename (e.g., add timestamp to prevent collisions)
        console.log('--------storage filename----------');
        console.log(file.fieldname);
        console.log(file.originalname);
        console.log(file.filename);
        //cb(null, req.body.blogId + '_' + req.body.uiAction + '_' + Date.now() + path.extname(file.originalname));
        cb(null, file.originalname);
    }
});

/*const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  } 
});*/

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
const tempDir = path.join(rootAppDir, '/uploads/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// File Upload
fileUploadRoutes.post("/fileUpload/uploadBlogImage", upload.single('blogImage'), (req: Request, res: Response) => {
  if (req.file) {
      console.log('File uploaded:', req.file.filename);
      res.status(200).send('File uploaded successfully!');
  } else {
      res.status(400).send('No file uploaded.');
  }
});

// File Upload - Content Imange
/*fileUploadRoutes.post("/fileUpload/uploadBlogContentImage", upload.single('UploadFiles'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).send({ error: 'No file uploaded.' });
  }
  else {
    console.log('uploadBlogContentImage File uploaded:', req.file.filename);
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    //Syncfusion's RTE expects a specific JSON response format.
    console.log('fileUrl:', fileUrl);
    console.log('----------------req body----------');
    console.log(req.body);
    res.status(200).json({
      url: fileUrl
    });
  }
});*/

fileUploadRoutes.post("/fileUpload/uploadBlogContentImage", upload.single('UploadFiles'), (req: Request, res: Response) => {
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
    //const originalName = uploadedFile.originalname;
    const targetFileName = req.body.targetFileName;
    //const fileExtension = path.extname(originalName);
    console.log('Custom data - uiAction:', uiAction);
    console.log('Custom data - userId:', userId);
    console.log('Custom data - targetFileName:', targetFileName);
    console.log('Custom data - blogId:', blogId);

    console.log('--------------Folder Names-------------');
    console.log("-----------appFolderName------------");
    console.log(appFolderName);
    console.log("-----------tempDir------------");
    console.log(tempDir);
    console.log("-----------rootAppDir------------");
    console.log(rootAppDir);

    // Create a new, unique filename
    const newFileName = `${targetFileName}`;
    console.log("-----------newFileName------------");
    console.log(newFileName);

    // Define the destination path for the final file
    const finalDir = path.join(rootAppDir, './uploads/images');
    console.log("-----------finalDir------------");
    console.log(finalDir);
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }
    const finalFilePath = path.join(finalDir, newFileName);

    // Move the file from the temporary location to the final destination
    fs.renameSync(uploadedFile.path, finalFilePath);

    console.log(`File renamed and moved: ${uploadedFile.path} -> ${finalFilePath}`);

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
})


// File Delete Content Imange
fileUploadRoutes.post("/fileUpload/deleteBlogContentImage", uploadDelete.single('UploadFiles'), (req: Request, res: Response) => {
  console.log('----------------file Removing-----------------')
  //console.log(req.body);
  const filename = `blogContentImage_${req.body.blogId}_${req.body.targetFileName}`;
  console.log(filename);

  console.log("---------rootAppDir-------");
  console.log(rootAppDir);
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
        console.log(`Successfully deleted: ${filename}`);
        res.status(200).json({ message: 'File deleted successfully.' });
      }

      
  });
});

export default fileUploadRoutes;