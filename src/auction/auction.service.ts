import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateAuctionDto from './dtos/create-auction.dto';
import { Interval } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';
import { AUCTION_SORT_KEY } from '../constants/auctionSort';

@Injectable()
export class AuctionService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async findOne(id: string) {
    return await this.prisma.auction.findUniqueOrThrow({ where: { id } });
  }

  async findMany(userId: string) {
    return await this.prisma.auction.findMany({
      where: { creater_id: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findLive(
    sortBy: string,
    page: number,
    itemsPerPage: number,
    category_id: number,
  ) {
    const start = (page - 1) * itemsPerPage;
    const end = itemsPerPage;

    const filter =
      category_id === 0
        ? { isComplete: false }
        : { isComplete: false, auction_categoryId: category_id };

    return await this.prisma.auction.findMany({
      where: filter,
      include: {
        auction_category: true,
        creator: { select: { username: true, email: true } },
        item: { select: { name: true, description: true, imageUrl: true } },
        _count: { select: { bids: true } },
      },
      orderBy: AUCTION_SORT_KEY[sortBy],
      skip: start,
      take: end,
    });
  }

  async createOne(data: CreateAuctionDto, userId: string) {
    const item = await this.prisma.item.findFirst({
      where: { AND: [{ id: data.item_id }, { owner_id: userId }] },
    });
    if (!item)
      throw new ForbiddenException(
        'not authorized to create an auction for this item',
        { cause: new Error(), description: 'Forbidden' },
      );
    if (item.isSold)
      throw new ForbiddenException('Item has already been sold', {
        cause: new Error(),
        description: 'Forbidden',
      });
    if (!item.isApproved)
      throw new ForbiddenException('Item has to be approved to be auctioned', {
        cause: new Error(),
        description: 'Forbidden',
      });

    if (item.item_type_id !== data.auction_categoryId)
      throw new ForbiddenException(
        'Auction category should match item category',
        {
          cause: new Error(),
          description: 'Forbidden',
        },
      );

    const auction = await this.prisma.auction.findFirst({
      where: { AND: [{ item_id: data.item_id, isComplete: false }] },
    });

    if (auction)
      throw new ConflictException('There is an ongoing auction for this item', {
        cause: new Error(),
        description: 'Conflict',
      });

    return await this.prisma.auction.create({
      data: { ...data, creater_id: userId },
    });
  }

  async updateOne(data: any, id: string) {
    return await this.prisma.auction.update({ where: { id }, data: data });
  }

  async deleteOne(id: string) {
    return await this.prisma.auction.delete({ where: { id } });
  }

  @Interval(1000 * 60 * 10)
  async checkAuctionCompletion() {
    console.log(`checking ended auctions - ${new Date()}`);
    const lastTenMinutes = new Date(Date.now() - 1000 * 60 * 11);
    const auctions = await this.prisma.auction.findMany({
      where: {
        deadline: { gte: lastTenMinutes, lte: new Date() },
        isComplete: false,
      },
      include: { bids: { orderBy: { bid_time: 'desc' } } },
    });
    auctions.forEach(async (auction) => {
      const hasBids = auction.bids.length !== 0;
      if (hasBids) {
        const topBid = auction.bids[0];
        await this.prisma.item.update({
          where: { id: auction.item_id },
          data: { isSold: true, winning_bid_id: topBid.id },
        });
      }
      await this.prisma.auction.update({
        where: { id: auction.id },
        data: { isComplete: true },
      });

      const pushMessage = {
        title: 'Auction ended',
        data: hasBids ? 'Sold' : 'Unsold',
        href: `/auction/${auction.id}`,
      };

      await this.notificationService.sendPush(auction.id, pushMessage);
    });
  }
}
