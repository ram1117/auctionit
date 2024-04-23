import { IsString, IsDate, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

class CreateAuctionDto {
  @IsString()
  item_id: string;
  @IsOptional()
  @IsDate()
  deadline: string;

  @IsNumber()
  @Transform(({ value }) => Number.parseFloat(value))
  start_value: number;

  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  auction_categoryId: number;
}

export default CreateAuctionDto;
