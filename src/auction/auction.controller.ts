import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import CreateAuctionDto from './dtos/create-auction.dto';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ItemService } from '../item/item.service';
import { User } from '../decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('auction')
export class AuctionController {
  constructor(
    private auctionService: AuctionService,
    private itemService: ItemService,
  ) {}

  @Get()
  getAuctions() {
    return this.auctionService.findMany();
  }

  @Get(':id')
  getAuction(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @Post()
  async createAuction(@Body() data: CreateAuctionDto, @User() user: any) {
    const item = await this.itemService.findOne(user.id, data.item_id);
    if (item.isSold)
      throw new ForbiddenException({
        message: 'Item has been already auctioned',
      });
    if (item.isApproved)
      throw new ForbiddenException({
        message: 'Item has to be approved to be auctioned',
      });
    return this.auctionService.createOne(data);
  }

  @Patch(':id')
  updateAuction(@Body() data: any, @Param('id') id: string) {
    return this.auctionService.updateOne(data, id);
  }
}
