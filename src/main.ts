import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('api/v1.0');
  await app.listen(5000);
  Logger.verbose(
    `API Server Started running on http://localhost:5000/api/v1.0`,
  );
}
bootstrap();
