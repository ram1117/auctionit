import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';
import { UserService } from '../user/user.service';
import CreateUserDto from '../user/dtos/createuser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signin')
  signin(@Body() data: SigninDto) {
    return this.authService.validateUser(data);
  }

  @Post('signup')
  signup(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Post('signout')
  signout() {}
}
