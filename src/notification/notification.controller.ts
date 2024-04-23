import { Body, Controller, Post, UseGuards, Param, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AcceptNotificationDto } from './dtos/acceptNotification.dto';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('token')
  postToken(@Body() data: AcceptNotificationDto, @User() user: any) {
    return this.notificationService.addToken(user.id, data);
  }

  @Post('subscribe/:id')
  subscribeTopic(@Param('id') auction_id: string, @User() user: any) {
    return this.notificationService.subscribeTopic(user.id, auction_id);
  }

  @Post('unsubscribe/:id')
  unsubscribeTopic(@Param('id') auction_id: string, @User() user: any) {
    return this.notificationService.unsubscribeTopic(user.id, auction_id);
  }

  @Get('tokens')
  getNotificationTokens(@User() user: any) {
    return this.notificationService.getUserTokens(user.id);
  }
}
