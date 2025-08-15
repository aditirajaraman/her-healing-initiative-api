// src/s3.ts
import { S3Client } from '@aws-sdk/client-s3';

// include configs
require("dotenv").config();
require("../config/appConfig");

console.log('---------------AWS Secrets-------');
//console.log(process.env.awsAccessKeyId);
//console.log(process.env.awsSecretAccessKey);
//console.log(`apiEndpoint : ${config.apiEndpoint} `);
//console.log(`allowedOrigins : ${config.webClient} `);

// Set up your S3 client using environment variables
// It's recommended to configure credentials and region this way
// for production applications.
// Create S3 service object
const AWSS3Client = new S3Client({
  region: process.env.awsS3BucketRegion,
  credentials: {
    accessKeyId:process.env.awsAccessKeyId,
    secretAccessKey:process.env.awsSecretAccessKey
  },
});

export { AWSS3Client };