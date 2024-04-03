import { Exclude } from 'class-transformer';

class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @Exclude()
  password: string;
  @Exclude()
  role: string;
  @Exclude()
  isVerified: boolean;
}

export default UserEntity;
