import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateUserDto from './dtos/createuser.dto';
import UserEntity from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/updateuser.dto';
import { PasswordDto } from './dtos/password.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneEmail(email: string) {
    const user = await this.prisma.user_.findUnique({ where: { email } });
    if (user) return new UserEntity(user);
    throw new NotFoundException({
      message: 'User with given email not found',
      error: 'NotFound',
    });
  }

  async findOne(username: string) {
    const user = await this.prisma.user_.findUnique({ where: { username } });
    return new UserEntity(user);
  }

  async findOneById(id: string) {
    const user = await this.prisma.user_.findUnique({
      where: { id },
      include: { subscription: true },
    });
    return new UserEntity(user);
  }

  async create(data: CreateUserDto) {
    const { password, ...rest } = data;
    const hashedPwd = await bcrypt.hash(password, 10);
    await this.prisma.user_.create({ data: { ...rest, password: hashedPwd } });
    return { success: true, message: 'User created successfully' };
  }

  async updateOne(data: UpdateUserDto, id: string) {
    return await this.prisma.user_.update({
      where: { id },
      data: { username: data.username },
    });
  }

  async updatePassword(data: PasswordDto, id: string) {
    const hashedPwd = await bcrypt.hash(data.password, 10);
    return await this.prisma.user_.update({
      where: { id },
      data: { password: hashedPwd },
    });
  }
}
