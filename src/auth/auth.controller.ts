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
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    return { message: 'Signin Successful' };
  }

  @Post('signup')
  signup(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  signout(@Response({ passthrough: true }) res: any) {
    res.clearCookie('token');
    return { message: 'signed out successfully' };
  }
}
