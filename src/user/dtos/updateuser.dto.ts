import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(8, { message: 'username should be between 8 and 12 characters' })
  @MaxLength(12, { message: 'username should be between 8 and 12 characters' })
  @Matches(/^\S+$/, { message: 'username should not have white spaces' })
  username: string;
}
