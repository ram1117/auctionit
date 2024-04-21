import { Transform } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

class CreateItemDto {
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  item_type_id: number;

  @IsString()
  imageUrl: string;
}

export default CreateItemDto;
