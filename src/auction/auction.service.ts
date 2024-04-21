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
    return await this.prisma.auction.findFirst({
      where: { id },
      include: {
        item: true,
        bids: {
          orderBy: { price: 'desc' },
          take: 1,
          include: { bidder: { select: { username: true } } },
        },
      },
    });
  }

  async findManyAdmin(status: string) {
    const statusQuery = {
      all: {},
      live: { isComplete: false, isCancelled: false },
      ended: { isComplete: true, isCancelled: false },
      cancelled: { isCancelled: true },
    };

    const query = statusQuery[status];

    return await this.prisma.auction.findMany({
      orderBy: { createdAt: 'desc' },
      where: query,
      include: {
        item: { select: { imageUrl: true, name: true, final_price: true } },
        _count: { select: { bids: true } },
      },
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
        ? { isComplete: false, isCancelled: false }
        : {
            isComplete: false,
            auction_categoryId: category_id,
            isCancelled: false,
          };

    return await this.prisma.auction.findMany({
      where: filter,
      orderBy: AUCTION_SORT_KEY[sortBy],
      include: {
        auction_category: true,
        item: { select: { name: true, description: true, imageUrl: true } },
        _count: { select: { bids: true } },
        bids: {
          orderBy: { price: 'desc' },
          take: 1,
        },
      },
      skip: start,
      take: end,
    });
  }

  async findManyCategories() {
    return await this.prisma.auction_category.findMany({
      select: { id: true, type: true },
    });
  }

  async createOne(data: CreateAuctionDto) {
    const item = await this.prisma.item.findFirst({
      where: { AND: [{ id: data.item_id }] },
    });
    if (!item)
      throw new ForbiddenException('Item doesnt exist', {
        cause: new Error(),
        description: 'Forbidden',
      });
    if (item.isSold)
      throw new ForbiddenException('Item has already been sold', {
        cause: new Error(),
        description: 'Forbidden',
      });
    if (item.not_for_sale)
      throw new ForbiddenException('Item is not for sale', {
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
      data: { ...data },
    });
  }

  async updateOne(id: string) {
    return await this.prisma.auction.update({
      where: { id },
      data: { isCancelled: true, isComplete: false },
    });
  }

  async deleteOne(id: string) {
    return await this.prisma.auction.delete({ where: { id } });
  }

  @Interval(1000 * 60 * 5)
  async checkAuctionCompletion() {
    console.log(`checking ended auctions - ${new Date()}`);
    const lastTenMinutes = new Date(Date.now() - 1000 * 60 * 6);
    const auctions = await this.prisma.auction.findMany({
      where: {
        deadline: { gte: lastTenMinutes, lte: new Date() },
        isComplete: false,
        isCancelled: false,
      },
      include: { bids: { orderBy: { bid_time: 'desc' } } },
    });
    auctions.forEach(async (auction) => {
      const hasBids = auction.bids.length !== 0;
      if (hasBids) {
        const topBid = auction.bids[0];
        await this.prisma.item.update({
          where: { id: auction.item_id },
          data: {
            isSold: true,
            winner_id: topBid.bidder_id,
            final_price: topBid.price,
            win_bid_id: topBid.id,
          },
        });
      }
      await this.prisma.auction.update({
        where: { id: auction.id },
        data: { isComplete: true },
      });

      const pushMessage = {
        title: 'Auction ended',
        data: hasBids ? 'Sold' : 'Unsold',
        href: `/auctions/${auction.id}`,
      };

      await this.notificationService.sendPush(auction.id, pushMessage);
    });
  }
}
