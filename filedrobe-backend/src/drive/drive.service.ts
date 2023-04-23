import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDrive } from './entities/user-drive.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class DriveService {
  constructor(
    @InjectRepository(UserDrive) private userDrive: Repository<UserDrive>,
    private profileService: ProfileService,
  ) {}
  async getDriveById(driveId: string) {
    const drive = await this.userDrive.findOne({ where: { id: driveId } });
    return drive;
  }

  async getDriveByProfile(profileId: string) {
    const profile = await this.profileService.getProfileById(profileId, true);
    const drive = profile.drive;
    return drive;
  }
}
