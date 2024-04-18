import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
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
@Roles(USER_ROLES.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ItemController {
  constructor(
    private itemService: ItemService,
    private supabaseService: SupabaseService,
  ) {}

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
    return this.itemService.create(data, imageUrl);
  }

  @Get('item/:id')
  getItemById(@User() user: any, @Param('id') id: string) {
    return this.itemService.findOne(user.id, id);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.itemService.deleteOne(id);
  }
}
