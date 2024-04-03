import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CreateUserDto from './dtos/createuser.dto';
import UserEntity from './entitiy/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user_.findUnique({ where: { id: id } });
    return new UserEntity(user);
  }

  async create(data: CreateUserDto) {
    await this.prisma.user_.create({ data: data });
    return { message: 'User created successfully' };
  }
}
