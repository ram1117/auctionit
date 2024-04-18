import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscribeService {
  constructor(private prisma: PrismaService) {}

  async findMany(userId: string) {
    return await this.prisma.subscription.findMany({
      where: { user_id: userId },
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

  async createOrUpdate(userId: string, auctionId: string) {
    return await this.prisma.subscription.upsert({
      where: { user_id_auction_id: { user_id: userId, auction_id: auctionId } },
      update: { notificationEnabled: true },
      create: {
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
