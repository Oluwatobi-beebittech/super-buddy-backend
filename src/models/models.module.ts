import { Module } from '@nestjs/common';

import { NotionBuddyModule } from './notionbuddy/notionbuddy.module';

const models = [NotionBuddyModule];

@Module({
  imports: models,
})
export class ModelsModule {}
