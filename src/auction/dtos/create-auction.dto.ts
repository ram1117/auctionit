import { IsString, IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

class CreateAuctionDto {
  @IsString()
  item_id: string;
  @IsOptional()
  @IsDate()
  deadline: string;

  @Transform(({ value }) => Number.parseFloat(value))
  start_value: number;

  @IsString()
  creater_id: string;
}

export default CreateAuctionDto;