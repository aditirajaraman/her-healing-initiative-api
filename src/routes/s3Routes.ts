import { Router, Request, Response, NextFunction } from "express";
import { ImageUploader, DocumentUploader } from '../utils/MutlerHandler';
var path = require('path');

// Use this interface to get the correct types for req.file
interface MulterS3File extends Express.Multer.File {
    location: string;
    key: string;
    bucket: string;
}

const s3Routes = Router();
const awsSDK = require("aws-sdk");


// Get all blogs
s3Routes.get("/listBuckets", (req: Request, res: Response, next: NextFunction) => {
  try {
    // Set the region
    awsSDK.config.update({ region: process.env.awsS3BucketRegion });

    // Create S3 service object
    const s3 = new awsSDK.S3({ apiVersion: "2006-03-01" });

    // Call S3 to list the buckets
    s3.listBuckets(function (err, data) {
      if (err) {
        console.log("Error Accessing AWS S3 Buckets", err);
      } else {
        res.json(data.Buckets);
      }
    });
  } catch (error: any) {
    next(error);
  }
});

s3Routes.post("/createBucket", (req: Request, res: Response, next: NextFunction) => {
  try {
      //const { name } = req.body;
      console.log("----------bucketName------");
      const bucketName = req.body.name;
      console.log(bucketName);;
      
      // Set the region
      awsSDK.config.update({ region: process.env.awsS3BucketRegion });

      // Create S3 service object
      const s3 = new awsSDK.S3({ apiVersion: "2006-03-01" });

      // Create the parameters for calling createBucket
      var bucketParams = {
        Bucket: bucketName
      };

      // call S3 to create the bucket
      s3.createBucket(bucketParams, function (err, data) {
        if (err) {
          console.log("Error", err);
          res.json({
            "status":false,
            "location":data.location
          });
        } else {
          //console.log("Success", data.Location);
          res.json({
            "status":true,
            "location":data.location
          });
        }
      });

    } catch (error) {
      next(error);
    }  
});

s3Routes.delete("/deleteBucket", (req: Request, res: Response, next: NextFunction) => {
  try {
    //const { name } = req.body;
    console.log("--------bucketName------");
    //console.log(req.body.name);
    const bucketName = req.body.name;
    console.log(bucketName);

    // Set the region
    awsSDK.config.update({ region: process.env.awsS3BucketRegion });

    // Create S3 service object
    const s3 = new awsSDK.S3({ apiVersion: "2006-03-01" });

    // Create the parameters for calling deleteBucket
    var bucketParams = {
      Bucket: bucketName
    };

    // call S3 to create the bucket
    s3.deleteBucket(bucketParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        //console.log("Success", data.Location);
        res.json({
          "status":true,
          "location":data.location
        });
      }
    });

  } catch (error) {
    next(error);
  }
});

s3Routes.post("/uploadImageToBucket", ImageUploader.single('image'), (req: Request, res: Response, next: NextFunction) => {
  const uploadedFile = req.file as MulterS3File;
  if (!uploadedFile) {
      console.error("No file was uploaded.");
      // Correct: Add 'return' to exit the function after sending the response.
      res.status(400).send('No file uploaded.');
  }

  // Now we know 'uploadedFile' is defined, so no need for the second 'if' check.
  // The previous 'if' block acts as a guard clause.
  console.log("--------UploadImageToBucket / uploadedFile here------");
  console.log("Bucket:", uploadedFile.bucket);
  console.log("Location:", uploadedFile.location);
  console.log("Key:", uploadedFile.key);
  console.log("Original Name:", uploadedFile.originalname);

  // Send the success response.
  res.status(200).json({
      message: 'Image uploaded successfully!',
      fileLocation: uploadedFile.location, // S3 URL
      key: uploadedFile.key,
      bucket: uploadedFile.bucket,
      originalname: uploadedFile.originalname
  });
});

s3Routes.post("/uploadDocumentToBucket", DocumentUploader.single('document'), (req: Request, res: Response, next: NextFunction) => {
  const uploadedFile = req.file as MulterS3File;
  if (!uploadedFile) {
      console.error("No file was uploaded.");
      // Correct: Add 'return' to exit the function after sending the response.
      res.status(400).send('No file uploaded.');
  }

  // Now we know 'uploadedFile' is defined, so no need for the second 'if' check.
  // The previous 'if' block acts as a guard clause.
  console.log("--------UploadDocumentToBucket / uploadedFile here------");
  console.log("Bucket:", uploadedFile.bucket);
  console.log("Location:", uploadedFile.location);
  console.log("Key:", uploadedFile.key);
  console.log("Original Name:", uploadedFile.originalname);

  // Send the success response.
  res.status(200).json({
      message: 'Document uploaded successfully!',
      fileLocation: uploadedFile.location, // S3 URL
      key: uploadedFile.key,
      bucket: uploadedFile.bucket,
      originalname: uploadedFile.originalname
  });
});

export default s3Routes;