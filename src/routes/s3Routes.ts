/*-----------------------------------imports----------------------------------------*/
import { Router, Request, Response, NextFunction } from "express";
import { ImageUploader, BlogHeaderImageUploader, BlogContentImageUploader, DocumentUploader } from '../utils/MutlerHandler';
import { 
  ListBucketsCommand, 
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand, 
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput 
} from "@aws-sdk/client-s3";
import multer from 'multer';

/*-----------------------------------imports / Custom -------------------------------*/
import config  from '../config/config';
import { AWSS3Client } from '../utils/AWSS3Client';
import { getS3FileContentAsString, renameS3Object } from '../utils/AWSS3Utils';

/*---------------------------Custom Interfaces/Properties/ Functions -----------------*/
// Use this interface to get the correct types for req.file
interface MulterS3File extends Express.Multer.File {
    location: string;
    key: string;
    bucket: string;
}

// Define an interface for the expected AWS SDK errors to improve type safety
interface AWSError extends Error {
  name: string;
  // You can add other properties like code, message, etc.
}

/*------------------------------------------routes------------------------------------*/
const s3Routes = Router();

// Get all blogs
s3Routes.get("/s3/listBuckets", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Create a command object. This encapsulates the specific API call.
    const command = new ListBucketsCommand({});

    // 2. Use the client to send the command. The .send() method returns a Promise.
    const data = await AWSS3Client.send(command);

    // 3. Handle the successful response.
    if (data.Buckets) {
      res.json(data.Buckets);
    } else {
      res.json([]);
    }
  } catch (error) {
    // 4. Handle any errors from the API call.
    console.error("Error Accessing AWS S3 Buckets", error);
    next(error); // Pass the error to the next error-handling middleware.
  }
});

// Get all blogs
s3Routes.get("/s3/getContent", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileKey = req.query.key as string;
    //console.log("---------------fileContent-------------");
    //console.log(config.AWS_S3_BUCKET_NAME);
    //console.log(fileKey);
    //const fileKey = "BlogContent_e482eccf-066f-4c5c-9e6d-1628900c5988.html";
    const fileContent = await getS3FileContentAsString(config.AWS_S3_BUCKET_NAME , fileKey);
    res.status(200).send(fileContent);
  } catch (error: any) {
    next(error);
  }
});

s3Routes.post("/s3/createBucket", async (req: Request, res: Response, next: NextFunction) => {
  try {
      const bucketName = req.body.name;

      if (!bucketName) {
        res.status(400).json({
          status: false,
          message: "Bucket name is required."
        });
      }

      const createBucketParams = {
        Bucket: bucketName,
      };

      // Create a new CreateBucketCommand with the parameters
      const command = new CreateBucketCommand(createBucketParams);

      // Send the command to the S3 client
      const data = await AWSS3Client.send(command);
      
      // Log the success data from the AWS response
      console.log("Success", data);

      res.json({
        status: true,
        message: "Bucket created successfully",
        location: data.Location // The location property is correctly capitalized here.
      });

    } catch (error) {
      // Check for a specific AWS S3 error
      if (error === 'BucketAlreadyOwnedByYou' || error === 'BucketAlreadyExists') {
        res.status(409).json({
          status: false,
          message: `A bucket with the name "${req.body.name}" already exists.`,
        });
      } else {
        console.error("Error creating bucket:", error);
        res.status(500).json({
          status: false,
          message: "An unexpected error occurred.",
          error: (error as Error).message,
        });
      }
      // Optionally, pass the error to the next middleware
      // next(error);
    }
});

s3Routes.post("/s3/deleteBucket", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bucketName = req.body.name;

    // Basic input validation: ensure the bucket name is provided
    if (!bucketName) {
      res.status(400).json({
        status: false,
        message: "Bucket name is required."
      });
    }

    // Define the parameters for the delete operation
    const deleteBucketParams = {
      Bucket: bucketName,
    };

    // Create a new DeleteBucketCommand object with the parameters
    const command = new DeleteBucketCommand(deleteBucketParams);

    // Send the command to the S3 client and await the response.
    // The AWS SDK v3 uses promises, which works perfectly with async/await.
    await AWSS3Client.send(command);

    // If the send() method completes without throwing an error, the bucket was successfully deleted.
    // The response for a successful deletion is typically an empty object.
    res.json({
      status: true,
      message: `Bucket "${bucketName}" deleted successfully.`
    });

  } catch (error) {
    // Log the detailed error for debugging purposes on the server
    console.error("Error deleting bucket:", error);

    if (error instanceof Error && typeof (error as AWSError).name === 'string') {
      // Handle specific S3 errors for more user-friendly responses.
      // The error object from the new SDK has a 'name' property that's helpful for this.
      let statusCode = 500;
      let message = "An unexpected error occurred while trying to delete the bucket.";
      
      switch (error.name) {
        case 'NoSuchBucket':
          statusCode = 404;
          message = `The bucket "${req.body.name}" does not exist.`;
          break;
        case 'BucketNotEmpty':
          statusCode = 409;
          message = `The bucket "${req.body.name}" is not empty and cannot be deleted. You must delete all objects first.`;
          break;
        case 'AccessDenied':
          statusCode = 403;
          message = "Access denied. You do not have the necessary permissions to delete this bucket.";
          break;
        // You can add more specific error cases here as needed
        default:
          // For all other errors, use a generic server error message
          break;
      }
      // Send a JSON error response to the client
      res.status(statusCode).json({
        status: false,
        message: message,
        error: (error as Error).message,
      });
    }
    else {
      // Handle the case where the error is not a standard Error object
      console.error("An unknown error occurred:", error);
      res.status(500).json({
        status: false,
        message: "An unknown error occurred.",
      });
      
      // Pass the error to the Express global error handler if needed
      // next(error);
    }
  }
});

//{"bucketName": "her-healing-initiative-blogcontents", "key":"pexels-lkloeppel-1307630.jpg"}
// upload.single('UploadFiles') - Trick for req.body being empty
const upload = multer();
s3Routes.post("/s3/deleteS3Object", upload.single('UploadFiles'), (req: Request, res: Response, next: NextFunction) => {
  try {
    //const { name } = req.body;
    //console.log("--------deleteS3Object------");
    //console.log(req);
    const bucketName = req.body.bucketName;
    const s3ObjectKey = req.body.key;
    //console.log(bucketName);
    //console.log(s3ObjectKey);

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
s3Routes.delete("/s3/deleteMultipleS3Objects", (req: Request, res: Response, next: NextFunction) => {
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


s3Routes.post("/s3/uploadBlogImageToBucket", BlogHeaderImageUploader.single('blogImage'), (req: Request, res: Response, next: NextFunction) => {
  const uploadedFile = req.file as MulterS3File;
  if (!uploadedFile) {
      console.error("No file was uploaded.");
      // Correct: Add 'return' to exit the function after sending the response.
       res.status(400).json({
        status:false,
        message: 'Blog Image Upload Failed!',
      });
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
      status:true,
      message: 'Image uploaded successfully!',
      fileLocation: uploadedFile.location, // S3 URL
      key: uploadedFile.key,
      bucket: uploadedFile.bucket,
      originalname: uploadedFile.originalname
  });
});

s3Routes.post("/s3/uploadBlogContentImage", BlogContentImageUploader.single('UploadFiles'), (req: Request, res: Response, next: NextFunction) => {
  const uploadedFile = req.file as MulterS3File;
  if (!uploadedFile) {
      console.error("No file was uploaded.");
      // Correct: Add 'return' to exit the function after sending the response.
      res.status(200).json({
        status:false,
        message: 'Blog Content Upload Failed!',
      });
  }

  // Now we know 'uploadedFile' is defined, so no need for the second 'if' check.
  // The previous 'if' block acts as a guard clause.
  /*console.log("--------uploadBlogContentImage / uploadedFile here------");
  console.log("Bucket:", uploadedFile.bucket);
  console.log("Location:", uploadedFile.location);
  console.log("Key:", uploadedFile.key);
  console.log("Original Name:", uploadedFile.originalname);
  console.log("BlogId:", req.body.blogId);*/

  let blogId = req.body.blogId;
  let oldFileName = uploadedFile.key;
  let newFileName = "BlogContentImage_" + blogId + '_' + uploadedFile.key;

  /*console.log("oldFileName:", oldFileName);
  console.log("newFileName:", newFileName);*/

  renameS3Object(uploadedFile.bucket, oldFileName, newFileName)
    .then(() => {
      console.log("Rename process completed.");
    })
    .catch((e) => {
      console.error("Failed to rename file:", e);
  });

  // Send the success response.
  res.status(200).json({
      status:true,
      message: 'Image uploaded successfully!',
      fileLocation: uploadedFile.location, // S3 URL
      key: newFileName,
      bucket: uploadedFile.bucket,
      originalname: uploadedFile.originalname
  });
});

s3Routes.post("/s3/uploadImageToBucket", ImageUploader.single('image'), (req: Request, res: Response, next: NextFunction) => {
  const uploadedFile = req.file as MulterS3File;
  if (!uploadedFile) {
      console.error("No file was uploaded.");
      // Correct: Add 'return' to exit the function after sending the response.
      res.status(400).json({status:false, message: 'Image uploaded successfully!'});
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
      status:true,
      message: 'Image uploaded successfully!',
      fileLocation: uploadedFile.location, // S3 URL
      key: uploadedFile.key,
      bucket: uploadedFile.bucket,
      originalname: uploadedFile.originalname
  });
});

s3Routes.post("/s3/uploadDocumentToBucket", DocumentUploader.single('document'), (req: Request, res: Response, next: NextFunction) => {
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

// A route to upload rich text content
s3Routes.post("/s3/uploadRichText", (req: Request, res: Response, next: NextFunction)  => {
  console.log("--------uploadRichText here------");
  let content = req.body.content;
  let blogId = req.body.blogId;
  console.log(blogId);
  console.log(content);

  if (!content) {
    res.status(400).send({ status:false, message: 'Content is required.' });
  }
  else
  {
    // Create a unique filename for the S3 object
    const filename = `BlogContent_${blogId}.html`;

    const params:PutObjectCommandInput  = {
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: `${filename}`, // Stores the files in a 'posts' folder
      Body: content,
      ContentType: 'text/html; charset=utf-8' // Important for a browser to render the content correctly
      //ACL: 'public-read', // Makes the file publicly accessible
    };

    try {
      const command = new PutObjectCommand(params);
      AWSS3Client.send(command);

      const fileUrl = `https://${params.Bucket}.s3.${config.AWS_S3_BUCKET_REGION}.amazonaws.com/${params.Key}`;

      res.status(200).json({
        status:true,
        message: 'Content uploaded successfully!',
        url: fileUrl,
      });
    } catch (error) {
      console.error('Error uploading to S3:', error);
      res.status(500).json(
        { 
          status:false,
          message: 'Error uploading content to S3.', error 
        });
    }
  }
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