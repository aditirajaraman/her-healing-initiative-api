// src/s3.ts
import { S3Client } from '@aws-sdk/client-s3';

// include configs
require("dotenv").config();
require("../config/config");

const environment = process.env.NODE_ENV;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3Bucket = process.env.S3_BUCKET_NAME;
const s3BucketRegion = process.env.AWS_S3_BUCKET_REGION;

console.log('----AWS S3 Client Configuration--------------');
console.log(environment);
console.log(awsAccessKeyId);
console.log(awsSecretAccessKey);
console.log(s3Bucket);
console.log(s3BucketRegion);

// Set up your S3 client using environment variables
// It's recommended to configure credentials and region this way
// for production applications.
// Create S3 service object
const AWSS3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey
  },
});

export { AWSS3Client };