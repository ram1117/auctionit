import { Expose, Type } from 'class-transformer';
import { BidderEntity } from './bidder.entity';

export class BidEntity {
  constructor(partial: Partial<BidEntity>) {
    Object.assign(this, partial);
  }
  id: string;
  auction_id: string;
  bidder_id: string;
  price: number;
  bid_time: Date;

  @Expose()
  @Type(() => BidderEntity)
  bidder: BidderEntity;
}
