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

@UseGuards(JwtAuthGuard)
@Controller('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Get(':userid')
  getAuctions() {
    return this.auctionService.findMany();
  }

  @Get(':id')
  getAuction(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @Post()
  createAuction(@Body() data: CreateAuctionDto) {
    return this.auctionService.createOne(data);
  }

  @Patch(':id')
  updateAuction(@Body() data: any, @Param('id') id: string) {
    return this.auctionService.updateOne(data, id);
  }
}
