import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceFactory } from './data-source.factory';
import { PatientInfrastructureModule } from './patient/modules/patient-infrastructure.module';
import { AuthInfrastructureModule } from './auth/modules/auth-infrastructure.module';
import { UserSystemInfrastructureModule } from './user-system/modules/user-system-infrastructure.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...DataSourceFactory.create(configService).options,
        autoLoadEntities: true,
      }),
    }),
    AuthInfrastructureModule,
    PatientInfrastructureModule,
    UserSystemInfrastructureModule,
  ],
  exports: [AuthInfrastructureModule, PatientInfrastructureModule],
})
export class DatabaseModule {}
