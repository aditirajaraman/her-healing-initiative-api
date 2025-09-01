/*-----------------------------------imports----------------------------------------*/
import { AWSS3Client} from './AWSS3Client';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import {
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

/*----------------------------------Utility Functionality---------------------------*/
/**
 * Renames an object in an S3 bucket.
 * This is done by copying the object to a new key and then deleting the old one.
 *
 * @param bucketName The name of the S3 bucket.
 * @param oldKey The current key (file name) of the object.
 * @param newKey The desired new key (file name) for the object.
 */
export async function renameS3Object(
  bucketName: string,
  oldKey: string,
  newKey: string
): Promise<void> {
  // Ensure the old and new keys are different.
  if (oldKey === newKey) {
    console.log("Old key and new key are the same. No action needed.");
    return;
  }

  try {
    // Step 1: Copy the object
    console.log(`Copying object from s3://${bucketName}/${oldKey} to s3://${bucketName}/${newKey}`);

    const copyParams = {
      Bucket: bucketName,
      CopySource: `/${bucketName}/${oldKey}`, // Format is /<bucket_name>/<object_key>
      Key: newKey,
    };

    const copyCommand = new CopyObjectCommand(copyParams);
    await AWSS3Client.send(copyCommand);

    console.log("Copy successful.");

    // Step 2: Delete the original object
    console.log(`Deleting original object at s3://${bucketName}/${oldKey}`);

    const deleteParams = {
      Bucket: bucketName,
      Key: oldKey,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await AWSS3Client.send(deleteCommand);

    console.log("Deletion successful. File renamed successfully!");
  } catch (error) {
    console.error("Error renaming S3 object:", error);
    throw error; // Re-throw the error to be handled by the caller.
  }
}

export async function getS3FileContentAsString (
  bucketName: string,
  fileKey: string
): Promise<string> {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    const command = new GetObjectCommand(params);
    const response = await AWSS3Client.send(command);

    if (!response.Body) {
      throw new Error('No body found in S3 response');
    }

    // The transformToString() method is a convenient way to read the stream and get a string.
    const fileContent = await response.Body.transformToString();
    return fileContent;
  } catch (error) {
    console.error('Error getting file from S3:', error);
    throw error;
  }
};

// Export it using CommonJS syntax
module.exports = {
  renameS3Object,
  getS3FileContentAsString
};

/*
// Example usage:
const myBucket = "your-s3-bucket-name";
const oldFileName = "documents/report_2024.pdf";
const newFileName = "documents/report_2025.pdf";

renameS3Object(myBucket, oldFileName, newFileName)
  .then(() => {
    console.log("Rename process completed.");
  })
  .catch((e) => {
    console.error("Failed to rename file:", e);
});
*/