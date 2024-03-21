import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateBidDto from './dtos/createBid.dto';

@Injectable()
export class BidService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return await this.prisma.bid.findUniqueOrThrow({ where: { id } });
  }

  async createOrUpdate(data: CreateBidDto) {
    const bid = await this.prisma.bid.findFirstOrThrow({
      where: {
        AND: { bidder_id: data.bidder_id, auction_id: data.auction_id },
      },
    });

    if (bid)
      return await this.prisma.bid.update({
        where: { id: bid.id },
        data: { price: data.price, bid_time: new Date() },
      });

    return await this.prisma.bid.create({
      data: { ...data, bid_time: new Date() },
    });
  }
}
