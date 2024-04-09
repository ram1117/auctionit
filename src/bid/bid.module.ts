import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { AuctionGateway } from '../gateways/auction.gateway';
import { AuctionModule } from '../auction/auction.module';

@Module({
  controllers: [BidController],
  providers: [BidService, AuctionGateway],
  imports: [AuctionModule],
  exports: [AuctionGateway],
})
export class BidModule {}
