import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { db } from '../../core/database/index.js';
import path from 'path';
import logger from '../../core/config/logger.js';

/**
 * Runs pending migrations to synchronize the database schema.
 * This is used for auto-creation of tables if they don't exist.
 */
export const runMigrations = async (): Promise<void> => {
  try {
    // Path to the migrations folder (drizzle folder at the root)
    const migrationsPath = path.resolve(process.cwd(), 'drizzle');

    logger.info(`Running migrations from: ${migrationsPath}`);

    await migrate(db, { migrationsFolder: migrationsPath });

    logger.info('Migrations completed successfully.');
  } catch (error) {
    logger.error('Migration failed:', { error });
    throw error;
  }
};
