import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { DATABASE_URL } from '@/config/constants';

const client = postgres(DATABASE_URL, { prepare: false });

const db = drizzle(client, { logger: true });

export default db;