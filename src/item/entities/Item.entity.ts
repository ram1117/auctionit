import { Exclude, Expose, Type } from 'class-transformer';

class User {
  id: string;
  username: string;
  email: string;
  @Exclude()
  role: string;
  @Exclude()
  password: string;
}

class WinBid {
  id: string;
  auction_id: string;
  @Exclude()
  bidder_id: string;
  price: number;
  bid_time: Date;
  @Expose()
  @Type(() => User)
  bidder: User;
}

class ItemEntity {
  constructor(partial: Partial<ItemEntity>) {
    Object.assign(this, partial);
  }
  id: string;
  item_id: string;
  deadline: Date;
  isComplete: boolean;
  isCancelled: boolean;
  createdAt: Date;
  start_value: number;
  auction_categoryId: number;

  @Expose()
  @Type(() => WinBid)
  win_bid: WinBid;
}

export default ItemEntity;
