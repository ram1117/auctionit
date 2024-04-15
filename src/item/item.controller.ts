import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ItemService } from './item.service';
import CreateItemDto from './dtos/CreateItem.dto';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, USER_ROLES } from '../decorators/roles.decorator.';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';
import { Public } from '../decorators/public.decorator';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(
    private itemService: ItemService,
    private supabaseService: SupabaseService,
  ) {}

  @Get()
  allItems(@User() user: any) {
    return this.itemService.findManyByUser(user.id);
  }

  @Public()
  @Get('types')
  getItemTypes() {
    return this.itemService.findManyTypes();
  }

  @Post()
  @UseInterceptors(FileInterceptor('item_image'))
  async createItem(
    @Body() data: CreateItemDto,
    @User() user: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 100000 })
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    let imageUrl = '';
    if (file) {
      imageUrl = await this.supabaseService.uploadImage(file, user.id);
    }
    return this.itemService.create(data, imageUrl, user.id);
  }

  @Get('item/:id')
  getItemById(@User() user: any, @Param('id') id: string) {
    return this.itemService.findOne(user.id, id);
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Patch('approve/:id')
  async approveItem(@Param('id') id: string) {
    const item = await this.itemService.updateApproval(id);

    if (!item) {
      return { error: true, message: 'Error approving the item' };
    }
    return { success: true, message: 'Item approved for auction' };
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Patch('approveall')
  async approveManyItems() {
    const items = await this.itemService.updateMany();

    if (!items) {
      return { error: true, message: 'Error approving the item' };
    }
    return { success: true, message: 'Item approved for auction' };
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Get('unapproved/all')
  getAllUnapprovedItems() {
    return this.itemService.findUnapproved();
  }

  @Roles(USER_ROLES.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.itemService.deleteOne(id);
  }
}
