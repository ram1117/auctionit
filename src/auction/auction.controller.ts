import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import CreateAuctionDto from './dtos/create-auction.dto';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Get('user')
  getAuctions(@User() user: any) {
    return this.auctionService.findMany(user.id);
  }

  @Get('live')
  getLiveAuctions() {
    return this.auctionService.findLive();
  }

  @Get(':id')
  getAuction(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @Post()
  async createAuction(@Body() data: CreateAuctionDto, @User() user: any) {
    return this.auctionService.createOne(data, user.id);
  }

  @Patch(':id')
  updateAuction(@Body() data: any, @Param('id') id: string) {
    return this.auctionService.updateOne(data, id);
  }
}
