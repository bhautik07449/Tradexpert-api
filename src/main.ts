import { StorageDriver, initializeTransactionalContext } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCompress from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import { ValidationException } from './common/validation-error';

import { join } from 'path';

async function bootstrap() {
  // This sets up a global context that remembers the current transaction automatically.

  // When you put @Transactional() on a method:
  // - The decorator automatically starts a transaction when the method is called.
  // - All repository calls inside know they belong to that transaction (because of the async context).
  // - If everything succeeds → commit happens.
  // - If an error is thrown → rollback happens.
  initializeTransactionalContext({ storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }));
  // Register compression plugin
  await app.register(fastifyCompress, { encodings: ['gzip', 'deflate'] });

  // Used to load environment variables from .env files.
  const configService = app.get(ConfigService);

  // Helmet helps secure your app by setting various HTTP headers to prevent vulnerabilities like XSS, clickjacking, etc.
  await app.register(fastifyHelmet, {
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });

  app.useStaticAssets({
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
  });

  // Lets you manage different versions of your API without breaking old clients.
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v'
  });

  // Automatically validates and cleans incoming request data based on DTOs.
  // Converts data types automatically
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      return new ValidationException(errors);
    }
  }));

  // Makes class-validator use Nest's DI system so you can inject services into your Custom validators.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: configService.get<string>("CORS_ORIGINS").split(','),
    methods: configService.get<string>("ALLOW_HTTP_VERBS").split(',')
  })
  const port = configService.get<number>("PORT") || configService.get<number>("API_PORT", 3030);
  const host = configService.get<string>("API_HOST", "0.0.0.0");

  await app.listen(port, host, () => {
    app.get(ConsoleLogger).log(`Application is running on: http://${host}:${port}`);
  });
}
bootstrap().catch(err => {
  new ConsoleLogger('Bootstrap').error(err);
});
