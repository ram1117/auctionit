import { IsString } from 'class-validator';
import { IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;
  @IsString()
  body: string;
  @IsString()
  href: string;
  @IsUUID()
  user_id: string;
}
