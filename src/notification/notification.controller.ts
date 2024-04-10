import { Body, Controller, Post, UseGuards, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AcceptNotificationDto } from './dtos/acceptNotification.dto';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post()
  postToken(@Body() data: AcceptNotificationDto, @User() user: any) {
    return this.notificationService.acceptPushNotification(user.id, data);
  }

  @Post('subscribe/:id')
  subscribeTopic(@Param('id') auction_id: string, @User() user: any) {
    console.log(auction_id);
    return this.notificationService.subscribeTopic(user.id, auction_id);
  }

  @Post('unsubscribe/:id')
  unsubscribeTopic(@Body('id') auction_id: string, @User() user: any) {
    return this.notificationService.unsubscribeTopic(user.id, auction_id);
  }
}
