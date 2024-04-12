import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient;
  constructor(private configService: ConfigService) {}
  onModuleInit() {
    const StorageUrl = this.configService.get('SUPABASE_STORAGE_URL');
    const ServiceKey = this.configService.get('SUPABASE_SERVICE_KEY');
    this.supabaseClient = createClient(StorageUrl, ServiceKey);
  }

  async uploadImage(imageFile: Express.Multer.File, userId: string) {
    const filepath = `${userId}/${crypto.randomUUID()}${imageFile.originalname}`;

    const {
      data: { path },
    } = await this.supabaseClient.storage
      .from('itemimages')
      .upload(filepath, imageFile.buffer, {
        contentType: 'image/jpg' || 'image/jpeg' || 'image/png',
        upsert: false,
      });

    const {
      data: { publicUrl },
    } = this.supabaseClient.storage.from('itemimages').getPublicUrl(path);

    return publicUrl;
  }
}
