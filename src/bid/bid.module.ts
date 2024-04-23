import { Module } from '@nestjs/common';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';
import { AuctionGateway } from '../gateways/auction.gateway';
import { AuctionModule } from '../auction/auction.module';
import { NotificationModule } from '../notification/notification.module';
import { SubscribeModule } from '../subscribe/subscribe.module';

@Module({
  controllers: [BidController],
  providers: [BidService, AuctionGateway],
  imports: [AuctionModule, NotificationModule, SubscribeModule],
})
export class BidModule {}
