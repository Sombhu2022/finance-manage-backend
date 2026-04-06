import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/index.js';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance App API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Finance Backend',
      contact: {
        name: 'Finance App support',
        email: 'support@financeapp.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
      {
        url: 'https://finance-manage-backend.vercel.app/',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/modules/**/*.routes.ts',
    './src/core/api/index.ts',
    './src/core/app.ts',
  ], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
