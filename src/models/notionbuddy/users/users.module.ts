import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotionBuddyUser } from './entities';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotionBuddyUser])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
