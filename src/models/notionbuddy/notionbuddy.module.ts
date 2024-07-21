import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { NotionModule } from './notion/notion.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, NotionModule, UsersModule],
})
export class NotionBuddyModule {}
