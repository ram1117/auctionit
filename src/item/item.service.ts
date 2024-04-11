import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateItemDto from './dtos/CreateItem.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async findManyByUser(userid: string) {
    return await this.prisma.item.findMany({ where: { owner_id: userid } });
  }

  async findOne(userid: string, id: string) {
    return await this.prisma.item.findFirstOrThrow({
      where: { id, owner_id: userid },
    });
  }

  async create(data: CreateItemDto, userId: string) {
    const dataWithId = { ...data, owner_id: userId };
    await this.prisma.item.create({ data: dataWithId });
    return { message: 'Item created successfully' };
  }

  async updateApproval(id: string) {
    return await this.prisma.item.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async findUnapproved() {
    return await this.prisma.item.findMany({
      where: { isApproved: false },
    });
  }
}
