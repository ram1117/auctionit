import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import CreateItemDto from './dtos/CreateItem.dto';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  allItems(@User() user: any) {
    return this.itemService.findManyByUser(user.id);
  }

  @Get(':id')
  getItemById(@User() user: any, @Param('id') id: string) {
    return this.itemService.findOne(user.id, id);
  }

  @Post()
  createItem(@Body() data: CreateItemDto) {
    return this.itemService.create(data);
  }
}
