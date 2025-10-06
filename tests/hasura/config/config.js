import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.test
dotenv.config({ path: path.resolve('./.env.test') });

const HASURA_ENDPOINT = process.env.HASURA_ENDPOINT
const ADMIN_SECRET = process.env.ADMIN_SECRET

const TEST_USERS = {
    citizen1: process.env.TEST_CITIZEN_1,
    citizen2: process.env.TEST_CITIZEN_2,
    official1: process.env.TEST_OFFICIAL_1,
}

export {
    HASURA_ENDPOINT,
    ADMIN_SECRET,
    TEST_USERS
}

// Optional: check required vars
if (!HASURA_ENDPOINT || !ADMIN_SECRET) {
  throw new Error('Missing HASURA_ENDPOINT or ADMIN_SECRET in environment variables');
}