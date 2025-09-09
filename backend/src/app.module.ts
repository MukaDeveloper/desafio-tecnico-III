import { ApplicationModule } from '@application/application.module';
import { MapperModule } from '@application/automapper/mapper.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PresentationModule } from '@presentation/presentation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ApplicationModule,
    InfrastructureModule,
    PresentationModule,
  ],
})
export class AppModule {}
