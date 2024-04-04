import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(data: SigninDto) {
    const user = await this.userService.findOne(data.username);
    if (user) {
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }
}
