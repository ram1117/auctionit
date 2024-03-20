import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

class CreateUserDto {
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Only alphabets and spaces allowed in full name',
  })
  @MinLength(6, { message: 'name should be at least 6 characters long' })
  fullname: string;

  @IsEmail({}, { message: 'email should be a valid email' })
  email: string;
  @IsString()
  @MinLength(8, { message: 'password should be at least 8 characters long' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password should contain at least one capital, one small letter, one special character and one number',
  })
  password: string;

  @IsString()
  @MinLength(8, { message: 'username should be between 8 and 12 characters' })
  @MaxLength(12, { message: 'username should be between 8 and 12 characters' })
  @Matches(/^\S+$/, { message: 'username should not have white spaces' })
  username: string;
  @IsString()
  location: string;
}

export default CreateUserDto;
