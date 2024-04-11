import { IsString } from 'class-validator';

export class AcceptNotificationDto {
  @IsString()
  device_type: string;
  @IsString()
  notification_token: string;
}
