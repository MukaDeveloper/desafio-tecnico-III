import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { ConfigService } from '@nestjs/config';
import { DataSourceFactory } from '@infrastructure/database/data-source.factory';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const config = app.get(ConfigService);

  const dataSource = DataSourceFactory.create(config);
  await dataSource.initialize();
  await dataSource.runMigrations();

  console.log('✅ Migrations applied.');
  await app.close();
}

bootstrap();
