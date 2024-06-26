import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateBidDto from './dtos/createBid.dto';
import { SubscribeService } from '../subscribe/subscribe.service';
import { BidEntity } from './enities/bid.entity';
import { NotificationService } from '../notification/notification.service';
import { AuctionService } from '../auction/auction.service';

@Injectable()
export class BidService {
  constructor(
    private prisma: PrismaService,
    private subscribeService: SubscribeService,
    private notificationService: NotificationService,
    private auctionService: AuctionService,
  ) {}

  async findMany(userId: string) {
    return await this.prisma.bid.findMany({
      where: { bidder_id: userId },
      include: { auction: { include: { item: true } } },
    });
  }

  async findOne(id: string) {
    const bid = await this.prisma.bid.findFirst({
      where: { auction_id: id },
      orderBy: { bid_time: 'desc' },
      include: { bidder: true },
    });
    return new BidEntity(bid);
  }

  async createOrUpdate(data: CreateBidDto, userId: string, username: string) {
    const auction = await this.auctionService.findOne(data.auction_id);
    if (!auction)
      throw new NotFoundException({
        message: 'Auction not found',
        error: 'NotFound',
      });
    if (auction.deadline < new Date() || auction.isCancelled) {
      throw new ForbiddenException('Auction might have ended or cancelled', {
        cause: new Error(),
        description: 'Forbidden',
      });
    }

    if (data.price < auction.start_value) {
      throw new ForbiddenException(
        'Bid price should be greater than start price',
        {
          cause: new Error(),
          description: 'Forbidden',
        },
      );
    }

    const bid = await this.prisma.bid.findFirst({
      where: {
        AND: {
          bidder_id: userId,
          auction_id: data.auction_id,
        },
      },
    });

    let newbid: any;
    if (!bid) {
      await this.subscribeService.createOrUpdate(userId, data.auction_id, {
        notificationEnabled: false,
      });

      newbid = await this.prisma.bid.create({
        data: { ...data, bid_time: new Date(), bidder_id: userId },
        include: { bidder: true },
      });
      return new BidEntity(bid);
    }

    newbid = await this.prisma.bid.update({
      where: { id: bid.id },
      data: { price: data.price, bid_time: new Date() },
      include: { bidder: true },
    });

    const pushMessage = {
      title: 'New Bid Alert',
      data: `${newbid.price} by ${username}`,
      href: `/auctions/${newbid.auction_id}`,
    };

    this.notificationService.sendPush(newbid.auction_id, pushMessage);

    return new BidEntity(newbid);
  }

  async deleteOne(id: string) {
    return await this.prisma.bid.delete({ where: { id } });
  }
}
