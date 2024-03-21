import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateAuctionDto from './dtos/create-auction.dto';

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return await this.prisma.auction.findUniqueOrThrow({ where: { id } });
  }

  async findMany() {
    return await this.prisma.auction.findMany();
  }

  async createOne(data: CreateAuctionDto) {
    const auction = await this.prisma.auction.create({ data });
    return auction;
  }

  async updateOne(data: any, id: string) {
    return await this.prisma.auction.update({ where: { id }, data: data });
  }
}
