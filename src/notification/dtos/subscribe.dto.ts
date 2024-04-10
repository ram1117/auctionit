import { IsUUID } from 'class-validator';

export class SubscribeDto {
  @IsUUID()
  auction_id: string;
}
