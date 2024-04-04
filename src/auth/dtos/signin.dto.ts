import { IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsString()
  @MinLength(8, { message: 'Username should be at least 8 characters long' })
  username: string;
  @IsString()
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password: string;
}
