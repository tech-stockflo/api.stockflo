// src/main.ts

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });

  app.setGlobalPrefix('api/v1');
  app.enableCors({credentials: true, origin: "http://localhost:3000"});
  app.use(cookieParser());
  app.use(morgan('tiny'));

  const config = new DocumentBuilder()
    .setTitle('SMS API Documentation')
    .setDescription('API documentation for the SMS application developed by PROP 😎')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.APP_PORT);
}
bootstrap();