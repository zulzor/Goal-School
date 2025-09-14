// config/loadEnv.js
const path = require('path');
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';

let envFile = '.env';
if (env === 'production') envFile = '.env.production';
if (env === 'test') envFile = '.env.test';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`✅ Loaded ${envFile} for NODE_ENV=${env}`);
