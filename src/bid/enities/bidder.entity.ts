import { Exclude } from 'class-transformer';

export class BidderEntity {
  username: string;
  email: string;
  @Exclude()
  fullname: string;
  @Exclude()
  password: string;
  @Exclude()
  location: string;
  @Exclude()
  role: string;
  @Exclude()
  id: string;
}
