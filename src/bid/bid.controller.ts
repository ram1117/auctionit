import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { BidService } from './bid.service';
import CreateBidDto from './dtos/createBid.dto';
import { AuctionGateway } from '../gateways/auction.gateway';
import { AuctionService } from '../auction/auction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';

@UseGuards(JwtAuthGuard)
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
  async createBid(@Body() data: CreateBidDto, @User() user: any) {
    const auction = await this.auctionService.findOne(data.auction_id);
    if (auction.deadline < new Date()) {
      throw new ForbiddenException('Auction might have ended');
    }

    if (auction.creater_id === user.id) {
      throw new ForbiddenException('You cannot place your bid in this auction');
    }
    const response = await this.bidService.createOrUpdate(data, user.id);

    const socketResponse: any = { ...response };
    this.auctionGateway.placeBidInRoom(socketResponse.auction_id, {
      value: response.price,
      username: user.username,
    });
    return {
      message: 'Bid has been placed successfully',
    };
  }

  @Delete()
  deleteBid() {}
}
