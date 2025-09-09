import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { GlobalExceptionFilter } from './domain/commons/exceptions/global-exception.filter';
import { ResponseStatusInterceptor } from './presentation/commons/interceptors/response-status.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseStatusInterceptor());

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API generated with Clean Architecture, JWT Auth and Migrations')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Bearer')
    .build();

  app.enableCors({
    origin: '*',
    maxAge: 21600,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
  });

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => `${controllerKey}_${methodKey}`,
  });

  SwaggerModule.setup('swagger', app, document);

  const isProd = process.env.NODE_ENV === 'production';

  const port = isProd ? process.env.PORT || 8080 : 3000;
  const server = await app.listen(port);

  const host = isProd ? `https://${process.env.PRODUCTION_BASE_URL}` : `http://localhost:${port}`;

  Logger.log('Server is listening on: ', server.address());
  Logger.log(`🚀 App rodando em: ${host}`);
}
bootstrap();
