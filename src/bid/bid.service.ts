import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateBidDto from './dtos/createBid.dto';
import { SubscribeService } from '../subscribe/subscribe.service';
import { BidEntity } from './enities/bid.entity';

@Injectable()
export class BidService {
  constructor(
    private prisma: PrismaService,
    private subscribeService: SubscribeService,
  ) {}

  async findOne(id: string) {
    const bid = await this.prisma.bid.findFirst({
      where: { auction_id: id },
      orderBy: { bid_time: 'desc' },
      include: { bidder: true },
    });
    return new BidEntity(bid);
  }

  async createOrUpdate(data: CreateBidDto, userId: string) {
    const bid = await this.prisma.bid.findFirst({
      where: {
        AND: { bidder_id: userId, auction_id: data.auction_id },
      },
    });

    let newbid: any;
    if (!bid) {
      await this.subscribeService.create(userId, data.auction_id);

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

    return new BidEntity(newbid);
  }

  async deleteOne(id: string) {
    return await this.prisma.bid.delete({ where: { id } });
  }
}
