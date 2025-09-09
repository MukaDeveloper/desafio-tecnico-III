import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { ConfigService } from '@nestjs/config';
import { DataSourceFactory } from '@infrastructure/database/data-source.factory';
import { ContextAccess } from '@middleware/context/context.access';
import { createDefaultPatient } from '../seed/create-default-patient.seed';
import { createDefaultExam } from '../seed/create-default-exam.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const config = app.get(ConfigService);
  const dataSource = DataSourceFactory.create(config);
  await dataSource.initialize();

  // 1) contexto inicial (org ainda desconhecida)
  const seedCtx = {
    patient: {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Seeder',
      type: 'System',
      email: 'seeder@mobilemed.com.br',
    },
    url: 'seed://bootstrap',
  } as const;

  await ContextAccess.run(seedCtx, async () => {
    await createDefaultPatient(dataSource);
    await createDefaultExam(dataSource);
  });

  console.log('✅ Seeds executed successfully.');
  await dataSource.destroy();
  await app.close();
}

bootstrap();
