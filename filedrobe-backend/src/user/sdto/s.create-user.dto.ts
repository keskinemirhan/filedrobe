import { Profile } from 'src/profile/entities/profile.entity';

export class SCreateUserDto {
  email: string;

  password: string;

  username: string;

  profile: Profile;
}
