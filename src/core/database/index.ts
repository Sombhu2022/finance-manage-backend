import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { config } from '../config/index.js';
import * as usersSchema from '../../modules/users/v1/users.model.js';
import * as financeSchema from '../../modules/finance/v1/finance.model.js';

// Neon serverless connection pool
const client = new Pool({
  connectionString: config.databaseUrl,
});

export const db = drizzle(client, {
  schema: {
    ...usersSchema,
    ...financeSchema,
  },
});
