import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  ForbiddenException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { BidService } from './bid.service';
import CreateBidDto from './dtos/createBid.dto';
import { AuctionGateway } from '../gateways/auction.gateway';
import { AuctionService } from '../auction/auction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { Roles, USER_ROLES } from '../decorators/roles.decorator.';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('bid')
export class BidController {
  constructor(
    private bidService: BidService,
    private auctionService: AuctionService,
    private auctionGateway: AuctionGateway,
  ) {}

  @Get('user/all')
  getUserBids(@User() user: any) {
    return this.bidService.findMany(user.id);
  }

  @Get(':auctionId')
  getTopBid(@Param('auctionId') auctionId: string) {
    return this.bidService.findOne(auctionId);
  }

  @Post()
  async createBid(@Body() data: CreateBidDto, @User() user: any) {
    const auction = await this.auctionService.findOne(data.auction_id);
    if (!auction)
      throw new NotFoundException({
        message: 'Auction not found',
        error: 'NotFound',
      });
    if (auction.deadline < new Date()) {
      throw new ForbiddenException('Auction might have ended', {
        cause: new Error(),
        description: 'Forbidden',
      });
    }

    if (data.price < auction.start_value) {
      throw new ForbiddenException(
        'Bid price should be greater than start price',
        {
          cause: new Error(),
          description: 'Forbidden',
        },
      );
    }

    if (user.role === USER_ROLES.Admin) {
      throw new ForbiddenException(
        'You cannot place your bid in this auction',
        { cause: new Error(), description: 'Forbidden' },
      );
    }
    const newbid = await this.bidService.createOrUpdate(
      data,
      user.id,
      user.username,
    );

    const payload = { price: newbid.price, username: user.username };
    this.auctionGateway.placeBidInRoom(newbid.auction_id, payload);

    return {
      success: true,
      message: 'Bid has been placed successfully',
    };
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  deleteBid(@Param('id') id: string) {
    this.bidService.deleteOne(id);
  }
}
