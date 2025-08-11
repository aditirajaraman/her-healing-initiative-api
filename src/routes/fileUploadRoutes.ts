import { Router, Request, Response } from "express";
import { useParams } from 'react-router-dom';
var path = require('path');
import { format, parse } from 'date-fns';

// Setup mutler
import multer from 'multer'; 

const fileUploadRoutes = Router();

const appFolderName = './uploads/'; 
const userName = 'rajaramans'; 

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
        //console.log('--------filename----------');
        //console.log(file.originalname);
        //const { blogId } = useParams();
        //console.log('--------blogId----------');
        //console.log(req.body.blogId);
        cb(null, req.body.blogId + '_' + req.body.uiAction + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  } 
});

// File Upload
fileUploadRoutes.post("/fileUpload/uploadImage", upload.single('blogImage'), (req: Request, res: Response) => {
  if (req.file) {
      console.log('File uploaded:', req.file.filename);
      res.status(200).send('File uploaded successfully!');
  } else {
      res.status(400).send('No file uploaded.');
  }
});

export default fileUploadRoutes;