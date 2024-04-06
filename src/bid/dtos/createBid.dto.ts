import { IsNumber, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

class CreateBidDto {
  @IsUUID()
  auction_id: string;

  @IsNumber()
  @Transform(({ value }) => Number.parseFloat(value))
  price: number;
}

export default CreateBidDto;
