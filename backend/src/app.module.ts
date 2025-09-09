import { ApplicationModule } from '@application/application.module';
import { MapperModule } from '@application/automapper/mapper.module';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { ContextMiddleware } from '@middleware/context/context.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PresentationModule } from '@presentation/presentation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MapperModule,
    ApplicationModule,
    InfrastructureModule,
    PresentationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
