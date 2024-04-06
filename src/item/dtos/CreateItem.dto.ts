import { Transform } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

class CreateItemDto {
  @IsString()
  @MinLength(3)
  @MaxLength(26)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  item_type_id: number;
}

export default CreateItemDto;
