import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import CreateUserDto from '../user/dtos/createuser.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signin(@Request() req: any) {
    return req.user;
  }

  @Post('signup')
  signup(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Post('signout')
  signout() {}
}
