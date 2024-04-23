import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateItemDto from './dtos/CreateItem.dto';
import ItemEntity from './entities/Item.entity';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const item = await this.prisma.item.findFirstOrThrow({
      where: { id },
      include: {
        auctions: { orderBy: { deadline: 'desc' } },
        win_bid: { include: { bidder: true } },
      },
    });

    return new ItemEntity(item);
  }

  async findManyByUser(id: string) {
    return await this.prisma.item.findMany({
      where: { winner_id: id },
    });
  }

  async findManyTypes() {
    return await this.prisma.item_type.findMany();
  }

  async findManyItems(status: string) {
    const ItemQuery = {
      sold: { isSold: true },
      unsold: { isSold: false, not_for_sale: false },
      nosale: { not_for_sale: true },
    };
    const condition = ItemQuery[status];

    return await this.prisma.item.findMany({
      where: condition,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateItemDto) {
    await this.prisma.item.create({
      data,
    });
    return { message: 'Item created successfully', success: true };
  }

  async deleteOne(id: string) {
    return await this.prisma.item.delete({ where: { id } });
  }

  async updateOne(id: string, notForSale: boolean) {
    const currenTime = new Date();
    if (notForSale)
      await this.prisma.auction.updateMany({
        where: { isComplete: false, isCancelled: false, item_id: id },
        data: { isCancelled: true, deadline: currenTime },
      });

    return await this.prisma.item.update({
      where: { id },
      data: { not_for_sale: notForSale },
    });
  }
}
