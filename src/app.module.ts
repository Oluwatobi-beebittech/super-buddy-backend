import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotionBuddyModule } from './notionbuddy/notionbuddy.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    NotionBuddyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
