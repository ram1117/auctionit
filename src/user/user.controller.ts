import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDto from './dtos/createuser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
}
