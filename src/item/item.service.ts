import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateItemDto from './dtos/CreateItem.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async findManyByUser(userid: string) {
    return await this.prisma.item.findMany({
      where: { owner_id: userid },
      select: { id: true, item_type_id: true },
    });
  }

  async findOne(userid: string, id: string) {
    return await this.prisma.item.findFirstOrThrow({
      where: { id, owner_id: userid },
    });
  }

  async findManyTypes() {
    return await this.prisma.item_type.findMany();
  }

  async create(data: CreateItemDto, imageUrl: string, userId: string) {
    await this.prisma.item.create({
      data: { ...data, imageUrl, owner_id: userId },
    });
    return { message: 'Item created successfully', success: true };
  }

  async updateApproval(id: string) {
    return await this.prisma.item.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async updateMany() {
    return await this.prisma.item.updateMany({
      where: { isApproved: false },
      data: { isApproved: true },
    });
  }

  async findUnapproved() {
    return await this.prisma.item.findMany({
      where: { isApproved: false },
    });
  }

  async deleteOne(id: string) {
    return await this.prisma.item.delete({ where: { id } });
  }
}
