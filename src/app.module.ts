import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { ModelsModule } from './models/models.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ModelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
