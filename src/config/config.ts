// Optional: Use a library like zod for validation
import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

// config 
const env = process.env.NODE_ENV || 'development';
//console.log('------environments/config----------');
//console.log(env);

switch (env) {
    case 'development':
        dotenv.config({ path: '.env.development' });
        break;
    case 'qa':
        dotenv.config({ path: '.env.qa' });
        break;
    case 'production':
        dotenv.config({ path: '.env.production' });
        break;
    default:
        throw new Error(`Unknown environment: ${env}`);
}

// Config Sche,a Validation
const envSchema = z.object({   
    API_PORT: z.string().transform((val) => parseInt(val, 10)),
    WEB_CLIENT: z.string(),
    POSTMAN_CLIENT: z.string(),
    MONGODB_CONNECTION_STRING: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_S3_BUCKET_REGION: z.string(),
    AWS_S3_BUCKET_NAME: z.string(),
    SESSION_SECRET: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string(),
    MUTLER_UPLOADS_DIR: z.string()
});

// The `.safeParse` method is safer for catching errors without crashing the app.
const parsedEnv  = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // Log the validation errors and crash the application if required variables are missing
  console.error(
    'X - Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables. Check the .env file.');
}

const appenv = parsedEnv.data;

export default appenv;