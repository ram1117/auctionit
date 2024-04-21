import { Controller, Post, Get, Body, UseGuards, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDto from './dtos/createuser.dto';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/updateuser.dto';
import { PasswordDto } from './dtos/password.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getUser(@User() user: any) {
    return this.userService.findOneById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('username')
  updateUsername(@Body() data: UpdateUserDto, @User() user: any) {
    return this.userService.updateOne(data, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(@Body() data: PasswordDto, @User() user: any) {
    return this.userService.updatePassword(data, user.id);
  }
}
