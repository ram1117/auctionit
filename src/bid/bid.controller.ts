import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { BidService } from './bid.service';
import CreateBidDto from './dtos/createBid.dto';

@Controller('bid')
export class BidController {
  constructor(private bidService: BidService) {}

  @Get(':id')
  getBid(@Param('id') id: string) {
    return this.bidService.findOne(id);
  }

  @Post()
  createBid(@Body() data: CreateBidDto) {
    return this.bidService.createOrUpdate(data);
  }

  @Delete()
  deleteBid() {}
}
