import { defineConfig } from 'drizzle-kit';

import { DATABASE_URL } from '@/config/constants';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/**/schema.ts',
    out: './src/sql/migrations',
    dbCredentials: {
        url: DATABASE_URL,
    },
});