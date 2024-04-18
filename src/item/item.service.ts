import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateItemDto from './dtos/CreateItem.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async findOne(userid: string, id: string) {
    return await this.prisma.item.findFirstOrThrow({
      where: { id },
    });
  }

  async findManyTypes() {
    return await this.prisma.item_type.findMany();
  }

  async create(data: CreateItemDto, imageUrl: string) {
    await this.prisma.item.create({
      data: { ...data, imageUrl },
    });
    return { message: 'Item created successfully', success: true };
  }

  async deleteOne(id: string) {
    return await this.prisma.item.delete({ where: { id } });
  }
}
