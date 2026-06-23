import { createApp } from './app';
import { connectDB, disconnectDB } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';

async function bootstrap() {
  await connectDB();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running at http://localhost:${env.PORT}${env.API_PREFIX}`);
    logger.info(`   Environment: ${env.NODE_ENV}`);
    logger.info(`   LLM: ${env.llmEnabled ? `${env.LLM_PROVIDER} (${env.LLM_MODEL})` : 'heuristic fallback (no key)'}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    // Force-exit if shutdown hangs.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  ['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)));

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason instanceof Error ? reason.stack : String(reason)}`);
  });
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.stack || err.message}`);
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  logger.error(`Failed to start server: ${err instanceof Error ? err.stack : String(err)}`);
  process.exit(1);
});
