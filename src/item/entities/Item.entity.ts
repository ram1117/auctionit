import { Exclude } from 'class-transformer';

class ItemEntity {
  constructor(partial: Partial<ItemEntity>) {
    Object.assign(this, partial);
  }
  @Exclude()
  owner_id: string;
}

export default ItemEntity;
