import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import CreateAuctionDto from './dtos/create-auction.dto';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { Roles, USER_ROLES } from '../decorators/roles.decorator.';
import { RolesGuard } from '../auth/guards/roles.guard';

@Roles(USER_ROLES.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auctions')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Public()
  @Get('live')
  getLiveAuctions(
    @Query('sortby') sortBy: string = 'newest',
    @Query('page') pageNo: string = '1',
    @Query('items') itemsPerPage: string = '50',
    @Query('category') category_id: string = '0',
  ) {
    return this.auctionService.findLive(
      sortBy,
      parseInt(pageNo),
      parseInt(itemsPerPage),
      parseInt(category_id),
    );
  }

  @Public()
  @Get('auction/categories')
  getAuctionCategories() {
    return this.auctionService.findManyCategories();
  }

  @Roles(USER_ROLES.User, USER_ROLES.Admin)
  @Get('auction/:id')
  getAuction(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @Get('admin/auctions')
  getAuctionsAdmin(@Query('status') status: string = 'all') {
    return this.auctionService.findManyAdmin(status);
  }

  @Post()
  createAuction(@Body() data: CreateAuctionDto) {
    return this.auctionService.createOne(data);
  }

  @Patch(':id')
  updateAuction(@Param('id') id: string) {
    return this.auctionService.updateOne(id);
  }

  @Delete(':id')
  deleteAuction(@Param() id: string) {
    return this.auctionService.deleteOne(id);
  }
}
