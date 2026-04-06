import createApp from './core/app.js';
import { config } from './core/config/index.js';
import logger from './core/config/logger.js';

const app = createApp();

const startServer = () => {
  try {
    const server = app.listen(config.port, () => {
      logger.info(
        `🚀 Server running in ${config.nodeEnv} mode at http://localhost:${config.port}`,
      );
      logger.info(`📋 Health check: http://localhost:${config.port}/health`);
    });

    // Handle Global Process Errors
    process.on(
      'unhandledRejection',
      (reason: Error, promise: Promise<void>) => {
        logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        // Application specific logging, throwing an error, or other logic here
        server.close(() => process.exit(1));
      },
    );

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    logger.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();
