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
} from '@nestjs/common';
import { ItemService } from './item.service';
import CreateItemDto from './dtos/CreateItem.dto';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, USER_ROLES } from '../decorators/roles.decorator.';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('item')
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

  @Post()
  @UseInterceptors(FileInterceptor('item_image'))
  async createItem(
    @Body() data: CreateItemDto,
    @User() user: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 100000 })
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    const imageUrl = await this.supabaseService.uploadImage(file, user.id);
    console.log(imageUrl);
    return this.itemService.create(data, user.id);
  }

  @Get(':id')
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
  @Get('unapproved/all')
  getAllUnapprovedItems() {
    return this.itemService.findUnapproved();
  }
}
