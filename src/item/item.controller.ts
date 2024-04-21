import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import CreateItemDto from './dtos/CreateItem.dto';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, USER_ROLES } from '../decorators/roles.decorator.';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Public } from '../decorators/public.decorator';

@Controller('items')
@Roles(USER_ROLES.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Public()
  @Get('types')
  getItemTypes() {
    return this.itemService.findManyTypes();
  }

  @Get('allitems')
  getUnauctioned(@Query('status') status: string) {
    return this.itemService.findManyItems(status);
  }

  @Roles(USER_ROLES.User, USER_ROLES.Admin)
  @Get('user/items')
  getUserItems(@User() user: any) {
    return this.itemService.findManyByUser(user.id);
  }

  @Post()
  async createItem(@Body() data: CreateItemDto) {
    return this.itemService.create(data);
  }

  @Get('item/:id')
  getItemById(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.itemService.deleteOne(id);
  }

  @Patch(':id')
  cancelItem(@Param('id') id: string, @Query('status') notForSale: string) {
    this.itemService.updateOne(id, notForSale === 'true');
  }
}
