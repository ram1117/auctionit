import { IsString, Matches, MinLength } from 'class-validator';

export class PasswordDto {
  @IsString()
  @MinLength(8, { message: 'password should be at least 8 characters long' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password should contain at least one capital, one small letter, one special character and one number',
  })
  password: string;
}
