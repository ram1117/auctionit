import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ItemService } from './item.service';
import CreateItemDto from './dtos/CreateItem.dto';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get(':userid')
  allItems(@Param('userid') userid: string) {
    return this.itemService.findManyByUser(userid);
  }

  @Get(':userid/:id')
  getItemById(@Param('userid') userid: string, @Param('id') id: string) {
    return this.itemService.findOne(userid, id);
  }

  @Post()
  createItem(@Body() data: CreateItemDto) {
    return this.itemService.create(data);
  }
}
