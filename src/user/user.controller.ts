import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDto from './dtos/createuser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
}
