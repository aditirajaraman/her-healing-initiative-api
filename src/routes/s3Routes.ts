import { Router, Request, Response, NextFunction } from "express";
import { ImageUploader, DocumentUploader } from '../utils/MutlerHandler';
import { AWSS3Client } from '../utils/AWSS3Client';
import { 
  DeleteObjectCommand, 
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput 
} from "@aws-sdk/client-s3";

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

//{"bucketName": "her-healing-initiative-blogcontents", "key":"pexels-lkloeppel-1307630.jpg"}
s3Routes.post("/deleteS3Object", (req: Request, res: Response, next: NextFunction) => {
  try {
    //const { name } = req.body;
    console.log("--------deleteS3Object------");
    //console.log(req.body.name);
    const bucketName = req.body.bucketName;
    const s3ObjectKey = req.body.key;
    console.log(bucketName);
    console.log(s3ObjectKey);

    //const BUCKET = "her-healing-initiative-blogcontents";
    //const KEY_TO_DELETE = "pexels-lkloeppel-1307630.jpg";
    deleteS3Object(bucketName, s3ObjectKey)
      .then(response => {
        // You can inspect the response object if needed.
        // For a simple delete, it will likely be an empty object,
        // but the successful promise resolution is the main indicator.
        console.log("Delete operation completed.");
        res.json({
          "status":true,
          "message":"Delete operation completed."
        });
      })
      .catch(err => {
        // The deleteS3Object function already logs the error,
        // so here you might just want to handle it gracefully.
        console.error("Failed to delete S3 object.");
        res.json({
          "status":true,
          "message":"Failed to delete S3 object."
        });
      });

  } catch (error) {
    next(error);
  }
});

//{"bucketName": "her-healing-initiative-blogcontents", "key":"pexels-lkloeppel-1307630.jpg"}
s3Routes.delete("/deleteMultipleS3Objects", (req: Request, res: Response, next: NextFunction) => {
  try {
    /*const KEYS_TO_DELETE = [
      "images/old-profile.jpg",
      "videos/temp-video.mp4"
    ];*/
    //const { name } = req.body;
    console.log("--------deleteMultipleS3Objects------");
    //console.log(req.body.name);
    const bucketName = req.body.bucketName;
    const s3ObjectKeys = req.body.keys;
    console.log(bucketName);
    console.log(s3ObjectKeys);

    //const BUCKET = "her-healing-initiative-blogcontents";
    //const KEY_TO_DELETE = "pexels-lkloeppel-1307630.jpg";
    deleteMultipleS3Objects(bucketName, s3ObjectKeys)
      .then(response => {
        if (response.Deleted) {
          console.log(`Successfully deleted ${response.Deleted.length} objects.`);
        }
      })
      .catch(err => {
        console.error("Failed to perform batch delete.");
      });
  } catch (error) {
    next(error);
  }
});


s3Routes.post("/uploadBlogImageToBucket", ImageUploader.single('blogImage'), (req: Request, res: Response, next: NextFunction) => {
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

s3Routes.post("/uploadBlogContentImage", ImageUploader.single('UploadFiles'), (req: Request, res: Response, next: NextFunction) => {
  const uploadedFile = req.file as MulterS3File;
  if (!uploadedFile) {
      console.error("No file was uploaded.");
      // Correct: Add 'return' to exit the function after sending the response.
      res.status(400).send('No file uploaded.');
  }

  // Now we know 'uploadedFile' is defined, so no need for the second 'if' check.
  // The previous 'if' block acts as a guard clause.
  console.log("--------uploadBlogContentImage / uploadedFile here------");
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


/**
 * Deletes a single object from an S3 bucket.
 * @param bucketName The name of the S3 bucket.
 * @param objectKey The key (path and name) of the object to delete.
 * @returns A promise that resolves with the S3 command output or rejects on error.
 */
export async function deleteS3Object(
  bucketName: string,
  objectKey: string
): Promise<DeleteObjectCommandOutput> {
  const deleteParams = {
    Bucket: bucketName,
    Key: objectKey,
  };

  const command = new DeleteObjectCommand(deleteParams);

  try {
    const response: DeleteObjectCommandOutput = await AWSS3Client.send(command);
    console.log(`Successfully deleted object with key: ${objectKey}`);
    return response;
  } catch (error) {
    console.error(`Error deleting object ${objectKey} from S3:`, error);
    throw error; // Propagate the error to the caller
  }
}

/**
 * Deletes multiple objects from an S3 bucket.
 * @param bucketName The name of the S3 bucket.
 * @param objectKeys An array of keys (paths and names) of the objects to delete.
 * @returns A promise that resolves with the S3 command output.
 */
export async function deleteMultipleS3Objects(
  bucketName: string,
  objectKeys: string[]
): Promise<DeleteObjectsCommandOutput> {
  if (!objectKeys || objectKeys.length === 0) {
    console.log("No objects to delete.");
    return {} as DeleteObjectsCommandOutput; // Return a default empty object for type compatibility
  }

  const deleteParams = {
    Bucket: bucketName,
    Delete: {
      Objects: objectKeys.map(key => ({ Key: key })),
      Quiet: false, // Set to true to suppress information about successfully deleted objects
    },
  };

  const command = new DeleteObjectsCommand(deleteParams);

  try {
    const response: DeleteObjectsCommandOutput = await AWSS3Client.send(command);
    console.log("Batch delete operation completed.");
    if (response.Errors && response.Errors.length > 0) {
      console.error("Some objects failed to delete:", response.Errors);
    }
    return response;
  } catch (error) {
    console.error("Error during batch delete from S3:", error);
    throw error;
  }
}

export default s3Routes;