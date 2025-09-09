import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AuditSubscriber } from '@infrastructure/database/subscribers/audit.subscriber';

export class DataSourceFactory {
  static buildOptions(config: ConfigService | { get: (k: string) => any }): DataSourceOptions {
    const isTsNode = process.argv.some((arg) => arg.includes('ts-node'));
    return {
      type: 'postgres',
      host: config.get('DB_HOST'),
      port: Number(config.get('DB_PORT')),
      username: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_DATABASE'),

      synchronize: false,

      logging: config.get('DB_LOGGING') === 'true' || config.get('DB_LOGGING') === true || false,

      entities: [isTsNode ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'],
      migrations: [
        isTsNode ? 'src/infrastructure/database/migrations/*.ts' : 'dist/infrastructure/database/migrations/*.js',
      ],
      subscribers: [AuditSubscriber],
    };
  }

  static create(config: ConfigService | { get: (k: string) => any }): DataSource {
    return new DataSource(this.buildOptions(config));
  }
}
