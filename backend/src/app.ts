import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import { morganStream } from './config/logger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { globalLimiter } from './middlewares/rateLimiter.middleware';

export function createApp(): Application {
  const app = express();

  app.set('trust proxy', 1);

  // Security & parsing
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL.split(',').map((o) => o.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(compression());

  // Logging
  app.use(morgan(env.isDev ? 'dev' : 'combined', { stream: morganStream }));

  // Serve uploaded files (e.g. resume downloads) statically.
  app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

  // Rate limiting + API routes
  app.use(env.API_PREFIX, globalLimiter, routes);

  // Root
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Seek Job API',
      data: { docs: `${env.API_PREFIX}/health` },
    });
  });

  // 404 + error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
