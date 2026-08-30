import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { EnvironmentVariables, NodeEnv } from './config/env.validation.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<EnvironmentVariables, true>);
  const logger = new Logger('Bootstrap');

  const prefix = config.get('API_PREFIX', { infer: true });
  const port = config.get('PORT', { infer: true });
  const origins = config
    .get('CORS_ORIGIN', { infer: true })
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.setGlobalPrefix(prefix);
  app.enableCors({ origin: origins, credentials: true });
  app.enableShutdownHooks();

  if (config.get('NODE_ENV', { infer: true }) !== NodeEnv.Production) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('AIHUB API')
        .setDescription('Authentication & authorization API for AIHUB')
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    );
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(port);
  logger.log(
    `API ready at http://localhost:${port}/${prefix} (docs: http://localhost:${port}/docs)`,
  );
}

await bootstrap();
