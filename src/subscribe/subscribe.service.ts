import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscribeService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { auction_id: id, user_id: userId },
    });
    if (!subscription)
      throw new NotFoundException({
        error: 'NotFound',
        message: 'Item Not found',
      });
    return subscription;
  }

  async findMany(userId: string) {
    return await this.prisma.subscription.findMany({
      where: { user_id: userId },
      orderBy: { auction: { deadline: 'desc' } },
      include: {
        auction: {
          include: {
            item: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
    });
  }

  async create(userId: string, auctionId: string) {
    return await this.prisma.subscription.create({
      data: { user_id: userId, auction_id: auctionId },
    });
  }
  async delete(userId: string, auctionId: string) {
    return await this.prisma.subscription.delete({
      where: { user_id_auction_id: { auction_id: auctionId, user_id: userId } },
    });
  }

  async createOrUpdate(
    userId: string,
    auctionId: string,
    data: { notificationEnabled: boolean },
  ) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { user_id: userId, auction_id: auctionId },
    });
    if (subscription) {
      const subscription = await this.prisma.subscription.update({
        where: {
          user_id_auction_id: { user_id: userId, auction_id: auctionId },
        },
        data: { notificationEnabled: data.notificationEnabled },
      });
      return subscription;
    }

    return await this.prisma.subscription.create({
      data: {
        user_id: userId,
        auction_id: auctionId,
        notificationEnabled: true,
      },
    });
  }

  async update(userId: string, auctionId: string) {
    return await this.prisma.subscription.update({
      where: { user_id_auction_id: { user_id: userId, auction_id: auctionId } },
      data: { notificationEnabled: false },
    });
  }
}
