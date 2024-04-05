import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateAuctionDto from './dtos/create-auction.dto';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return await this.prisma.auction.findUniqueOrThrow({ where: { id } });
  }

  async findMany(userId: string) {
    return await this.prisma.auction.findMany({
      where: { creater_id: userId },
    });
  }

  async findLive() {
    return await this.prisma.auction.findMany({
      where: { isComplete: false },
      include: { creator: true },
    });
  }

  async createOne(data: CreateAuctionDto) {
    return await this.prisma.auction.create({ data });
  }

  async updateOne(data: any, id: string) {
    return await this.prisma.auction.update({ where: { id }, data: data });
  }

  @Interval(1000 * 60 * 10)
  async checkAuctionCompletion() {
    const lastTenMinutes = new Date(Date.now() - 1000 * 60 * 11);
    const auctions = await this.prisma.auction.findMany({
      where: { deadline: { gte: lastTenMinutes }, isComplete: false },
      include: { bids: { orderBy: { bid_time: 'desc' } } },
    });
    console.log(auctions);
    auctions.forEach(async (auction) => {
      const hasBids = auction.bids.length !== 0;
      if (hasBids) {
        const topBid = auction.bids[0];
        await this.prisma.item.update({
          where: { id: auction.item_id },
          data: { isSold: true, winning_bid_id: topBid.id },
        });
      }
      this.prisma.auction.updateMany({
        where: { id: auction.id },
        data: { isComplete: true },
      });
    });
  }
}
