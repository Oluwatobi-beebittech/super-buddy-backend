import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { EnvConfig } from './environment.config';

const { DB_HOST, DB_PORT, DB_USER, DB_URL, DB_PASSWORD, DB_DATABASE } =
  EnvConfig;

console.log({ DB_HOST, DB_PORT, DB_USER, DB_URL, DB_PASSWORD, DB_DATABASE });

export const typeOrmConfig: MysqlConnectionOptions = {
  url: DB_URL,
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'superbuddy_migrations_table',
  migrationsRun: JSON.parse(
    process.env.DB_MIGRATIONS_RUN_ON_START ?? 'true',
  ) as boolean,
  logging: true,
};

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => typeOrmConfig,
};
