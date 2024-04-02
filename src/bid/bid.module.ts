import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { AuctionGateway } from '../gateways/auction.gateway';

@Module({
  controllers: [BidController],
  providers: [BidService, AuctionGateway],
})
export class BidModule {}
