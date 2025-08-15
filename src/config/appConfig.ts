const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'development';
console.log('------environments/config----------');
console.log(env);

switch (env) {
    case 'development':
        dotenv.config({ path: '.env.development' });
        break;
    case 'qa':
        dotenv.config({ path: '.env.qa' });
        break;
    case 'production':
        dotenv.config({ path: '.env.production' });
    default:
        throw new Error(`Unknown environment: ${env}`);
}