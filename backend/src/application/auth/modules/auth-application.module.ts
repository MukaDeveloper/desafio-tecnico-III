import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from '@application/auth/services/auth.service';
import { JwtStrategy } from '@application/auth/guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthProfile } from '../automapper/auth.profile';
import { AuthInfrastructureModule } from '@infrastructure/database/auth/modules/auth-infrastructure.module';
import { UserSystemInfrastructureModule } from '@infrastructure/database/user-system/modules/user-system-infrastructure.module';
import { UserSystemApplicationModule } from '@application/user-system/modules/user-system.module';

@Module({
  imports: [
    UserSystemApplicationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: parseInt(config.get<string>('JWT_EXPIRATION_SECONDS') || '86400', 10) },
      }),
    }),
    AuthInfrastructureModule,
    UserSystemInfrastructureModule,
  ],
  providers: [AuthService, JwtStrategy, AuthProfile],
  exports: [AuthService, PassportModule, JwtModule, AuthProfile],
})
export class AuthApplicationModule {}
