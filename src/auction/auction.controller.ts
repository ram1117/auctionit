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
import { User } from '../decorators/user.decorator';
import { Public } from '../decorators/public.decorator';
import { Roles, USER_ROLES } from '../decorators/roles.decorator.';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('auctions')
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Get('user')
  getAuctions(@User() user: any) {
    return this.auctionService.findMany(user.id);
  }

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
  @Get('auction/:id')
  getAuction(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Post()
  async createAuction(@Body() data: CreateAuctionDto, @User() user: any) {
    return this.auctionService.createOne(data, user.id);
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  updateAuction(@Body() data: any, @Param('id') id: string) {
    return this.auctionService.updateOne(data, id);
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  deleteAuction(@Param() id: string) {
    return this.auctionService.deleteOne(id);
  }
}
