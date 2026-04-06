import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { swaggerSpec } from './docs/swagger.js';
import { errorHandler, AppError } from '../shared/middlewares/error.js';
import apiRouter from './api/index.js';
import { runMigrations } from '../shared/utils/db-migrate.js';

const createApp = (): Application => {
  const app = express();

  // Swagger Documentation
  const swaggerOptions = {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js',
    ],
  };
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerOptions),
  );

  // Root Welcome Route
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to Zorvyn Finance API',
      version: '1.0.0',
      docs: '/api-docs',
    });
  });

  // Security Middleware
  app.use(helmet());

  const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: {
      status: 'error',
      message:
        'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api', limiter);

  // Body parser
  app.use(express.json());
  app.use(morgan('dev'));

  // Versioned API Routes
  app.use('/api', apiRouter);

  // Health check with auto-migration
  app.get('/health', async (_req: Request, res: Response) => {
    try {
      await runMigrations();
      res.status(200).json({
        status: 'OK',
        database: 'Connected & Migrated',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        status: 'ERROR',
        message: 'Database migration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Handle 404 errors
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
