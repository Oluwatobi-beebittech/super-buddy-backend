import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';

const models = [AuthModule];

@Module({
  imports: models,
  exports: models,
})
export class NotionBuddyModule {}
