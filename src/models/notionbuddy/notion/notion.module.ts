import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { NotionController } from './notion.controller';
import { NotionService } from './notion.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, HttpModule, UsersModule],
  controllers: [NotionController],
  providers: [NotionService],
  exports: [NotionService],
})
export class NotionModule {}
