import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscribeService } from './subscribe.service';
import { User } from '../decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('subscribe')
export class SubscribeController {
  constructor(private subscriptionService: SubscribeService) {}

  @Get()
  getAuctions(@User() user: any) {
    return this.subscriptionService.findMany(user.id);
  }

  @Get(':id')
  getAuction(@Param('id') id: string, @User() user: any) {
    return this.subscriptionService.findOne(id, user.id);
  }

  @Post(':id')
  subscribeToAuction(
    @Param('id') auction_id: string,
    @Query('enabled') enabled: string,
    @User() user: any,
  ) {
    return this.subscriptionService.createOrUpdate(user.id, auction_id, {
      notificationEnabled: enabled === 'true',
    });
  }

  @Post('/unsubscribe/:id')
  unsubscribeFromAuction(@Param('id') auction_id: string, @User() user: any) {
    return this.subscriptionService.delete(user.id, auction_id);
  }
}
