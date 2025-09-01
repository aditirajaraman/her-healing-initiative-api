/*-----------------------------------imports----------------------------------------*/
import { S3Client } from '@aws-sdk/client-s3';

/*-----------------------------Custom Interfaces/Properties/ Functions--------------*/
// include configs
import config  from '../config/config';

/*----------------------------------Utility Functionality---------------------------*/
console.log('---------------AWS Secrets-------');
//console.log(config.AWS_ACCESS_KEY_ID);
//console.log(config.AWS_SECRET_ACCESS_KEY);
//console.log(`allowedOrigins : ${config.WEB_CLIENT} `);

// Set up your S3 client using environment variables
// It's recommended to configure credentials and region this way
// for production applications.
// Create S3 service object
const AWSS3Client = new S3Client({
  region: config.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId:config.AWS_ACCESS_KEY_ID,
    secretAccessKey:config.AWS_SECRET_ACCESS_KEY
  },
});

export { AWSS3Client };