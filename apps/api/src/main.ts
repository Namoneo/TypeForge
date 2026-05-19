import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

async function bootstrap() {
  // Fail fast on missing env vars before binding any port
  const frontendUrl = process.env.NODE_ENV === 'production'
    ? requireEnv('FRONTEND_URL')
    : (process.env.FRONTEND_URL ?? 'http://localhost:4200');

  if (process.env.NODE_ENV === 'production') {
    requireEnv('JWT_SECRET');
    requireEnv('JWT_REFRESH_SECRET');
    requireEnv('DATABASE_URL');
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // needed for Swagger UI
  }));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TypeForge API')
    .setDescription('AI-Powered TypeScript Mastery Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  app.get(Logger).log(`TypeForge API → http://localhost:${port}`);
  app.get(Logger).log(`Swagger docs  → http://localhost:${port}/api/docs`);
}
bootstrap();
