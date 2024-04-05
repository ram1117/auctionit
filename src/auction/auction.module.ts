import { Module } from '@nestjs/common';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { ItemModule } from '../item/item.module';

@Module({
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
  imports: [ItemModule],
})
export class AuctionModule {}
