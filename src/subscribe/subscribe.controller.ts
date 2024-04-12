import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscribeService } from './subscribe.service';
import { User } from '../decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('subscribe')
@UseGuards(JwtAuthGuard)
export class SubscribeController {
  constructor(private subscriptionService: SubscribeService) {}

  @Get()
  getAuctions(
    @User() user: any,
    @Query('page') pageNo: string = '1',
    @Query('items') itemsPerPage: string = '50',
  ) {
    return this.subscriptionService.findMany(
      user.id,
      parseInt(pageNo),
      parseInt(itemsPerPage),
    );
  }

  @Post(':id')
  subscribeToAuction(@Param('id') auction_id: string, @User() user: any) {
    return this.subscriptionService.create(user.id, auction_id);
  }

  @Post('/unsubscribe/:id')
  unsubscribeFromAuction(@Param('id') auction_id: string, @User() user: any) {
    return this.subscriptionService.delete(user.id, auction_id);
  }
}
