import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { BidService } from './bid.service';
import CreateBidDto from './dtos/createBid.dto';
import { AuctionGateway } from '../gateways/auction.gateway';
import { AuctionService } from '../auction/auction.service';

@Controller('bid')
export class BidController {
  constructor(
    private bidService: BidService,
    private auctionService: AuctionService,
    private auctionGateway: AuctionGateway,
  ) {}

  @Get(':auctionId')
  getTopBid(@Param('auctionId') auctionId: string) {
    return this.bidService.findOne(auctionId);
  }

  @Post()
  async createBid(@Body() data: CreateBidDto) {
    const auction = await this.auctionService.findOne(data.auction_id);
    if (auction.deadline < new Date()) {
      throw new ForbiddenException('Auction might have ended');
    }

    if (auction.creater_id === '') {
      throw new ForbiddenException('You cannot place your bid in this auction');
    }
    const response = await this.bidService.createOrUpdate(data);

    const socketResponse: any = { ...response };
    this.auctionGateway.placeBidInRoom(socketResponse.auction_id, {
      value: response.price,
      username: response.bidder.username,
    });
    return {
      message: 'Bid has been placed successfully',
    };
  }

  @Delete()
  deleteBid() {}
}
