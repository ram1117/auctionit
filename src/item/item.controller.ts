import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ItemService } from './item.service';
import CreateItemDto from './dtos/CreateItem.dto';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, USER_ROLES } from '../decorators/roles.decorator.';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('item')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get()
  allItems(@User() user: any) {
    return this.itemService.findManyByUser(user.id);
  }

  @Post()
  createItem(@Body() data: CreateItemDto, @User() user: any) {
    return this.itemService.create(data, user.id);
  }

  @Get(':id')
  getItemById(@User() user: any, @Param('id') id: string) {
    return this.itemService.findOne(user.id, id);
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Patch('approve/:id')
  approveItem(@Param('id') id: string) {
    return this.itemService.updateApproval(id);
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Get('unapproved/all')
  getAllUnapprovedItems() {
    return this.itemService.findUnapproved();
  }
}
