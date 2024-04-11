import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateAuctionDto from './dtos/create-auction.dto';
import { Interval } from '@nestjs/schedule';
import { NotificationService } from '../notification/notification.service';

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

  private generateSortingObject(sortBy: string) {
    const orderByNew = { createdAt: 'desc' } as const;
    const orderByEndTime = { deadline: 'desc' } as const;
    const orderByPopular = {
      bids: { _count: 'desc' },
    } as const;

    let sortByCondition: any;
    switch (sortBy) {
      case 'popular':
        sortByCondition = orderByPopular;
        break;
      case 'deadline':
        sortByCondition = orderByEndTime;
        break;
      case 'newest':
        sortByCondition = orderByNew;
        break;
      default:
        sortByCondition = orderByNew;
        break;
    }

    return sortByCondition;
  }

  async findLive(sortBy: string, page: number, itemsPerPage: number) {
    const start = (page - 1) * itemsPerPage;
    const end = itemsPerPage;

    return await this.prisma.auction.findMany({
      where: { isComplete: false },
      include: {
        creator: true,
        item: { include: { item_type: true } },
        _count: { select: { bids: true } },
      },
      orderBy: this.generateSortingObject(sortBy),
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
