import { Transform } from 'class-transformer';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

class CreateItemDto {
  @IsString()
  @MinLength(3)
  @MaxLength(26)
  name: string;

  @IsString()
  @MinLength(10)
  @MaxLength(240)
  description: string;

  @Transform(({ value }) => Number.parseFloat(value))
  @IsOptional()
  starting_price: number;

  @IsString()
  owner_id: string;

  @Transform(({ value }) => Number.parseInt(value))
  item_type_id: number;
}

export default CreateItemDto;
