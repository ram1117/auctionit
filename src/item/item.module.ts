import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [SupabaseModule],
})
export class ItemModule {}
