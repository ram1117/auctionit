import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import CreateUserDto from '../user/dtos/createuser.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(
    @Request() req: any,
    @Response({ passthrough: true }) response: any,
  ) {
    const token = await this.authService.generateToken(req.user);
    response.cookie('token', token, {
      sameSite: 'strict',
      httpOnly: true,
    });
    return { message: 'Loging Success' };
  }

  @Post('signup')
  signup(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Post('signout')
  signout() {}
}