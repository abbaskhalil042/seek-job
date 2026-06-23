import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

mongoose.set('strictQuery', true);

/**
 * Establishes the MongoDB connection. Retries are intentionally left to the
 * caller (server.ts) so that startup failures are loud and explicit.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const conn = await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: !env.isProd, // build indexes in dev; manage explicitly in prod
  });

  logger.info(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

  mongoose.connection.on('error', (err) => logger.error(`MongoDB error: ${err.message}`));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));

  return conn;
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB connection closed');
}
