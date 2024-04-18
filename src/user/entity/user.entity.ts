import { Exclude } from 'class-transformer';

class UserEntity {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @Exclude()
  id: string;
  username: string;
  email: string;
  role: string;
  @Exclude()
  password: string;

  @Exclude()
  isVerified: boolean;
}

export default UserEntity;
