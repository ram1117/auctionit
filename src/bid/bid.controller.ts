import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { BidService } from './bid.service';
import CreateBidDto from './dtos/createBid.dto';
import { AuctionGateway } from '../gateways/auction.gateway';

@Controller('bid')
export class BidController {
  constructor(
    private bidService: BidService,
    private auctionGateway: AuctionGateway,
  ) {}

  @Get(':id')
  getBid(@Param('id') id: string) {
    return this.bidService.findOne(id);
  }

  @Post()
  async createBid(@Body() data: CreateBidDto) {
    const response = await this.bidService.createOrUpdate(data);

    const socketResponse: any = { ...response };
    this.auctionGateway.placeBidInRoom(
      socketResponse.auction_id,
      socketResponse,
    );
    return {
      success: true,
    };
  }

  @Delete()
  deleteBid() {}
}
