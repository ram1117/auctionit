import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateUserDto from './dtos/createuser.dto';
import UserEntity from './entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneEmail(email: string) {
    const user = await this.prisma.user_.findUnique({ where: { email } });
    return new UserEntity(user);
  }

  async findOne(username: string) {
    const user = await this.prisma.user_.findUnique({ where: { username } });
    return new UserEntity(user);
  }

  async findOneById(id: string) {
    const user = await this.prisma.user_.findUnique({ where: { id } });
    return new UserEntity(user);
  }

  async create(data: CreateUserDto) {
    const { password, ...rest } = data;
    const hashedPwd = await bcrypt.hash(password, 10);
    await this.prisma.user_.create({ data: { ...rest, password: hashedPwd } });
    return { success: true, message: 'User created successfully' };
  }
}
