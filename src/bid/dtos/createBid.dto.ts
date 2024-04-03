import { IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

class CreateBidDto {
  @IsUUID()
  auction_id: string;
  @IsUUID()
  bidder_id: string;

  @Transform(({ value }) => Number.parseFloat(value))
  price: number;
}

export default CreateBidDto;
