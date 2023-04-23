import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDrive } from './entities/user-drive.entity';
import { Repository } from 'typeorm';
import { ProfileService } from 'src/profile/profile.service';
import { DriveFolder } from './entities/drive-folder.entity';

@Injectable()
export class DriveService {
  constructor(
    @InjectRepository(UserDrive) private driveRepo: Repository<UserDrive>,
    @InjectRepository(DriveFolder) private folderRepo: Repository<DriveFolder>,
    private profileService: ProfileService,
  ) {}

  //dev
  async getAllDrive() {
    return await this.driveRepo.find();
  }

  async getDriveById(driveId: string) {
    const drive = await this.driveRepo.findOne({ where: { id: driveId } });
    return drive;
  }

  async getDriveByProfile(profileId: string) {
    const profile = await this.profileService.getProfileById(profileId, true);
    const drive = profile.drive;
    return drive;
  }

  async createDrive() {
    const drive = await this.driveRepo.create();
    const rootFolder = await this.createRootFolder();
    drive.rootFolder = rootFolder;
    return this.driveRepo.save(drive);
  }

  //FOLDER

  async createRootFolder() {
    const rootFolder = await this.folderRepo.create({ name: 'root' });
    const saved = await this.folderRepo.save(rootFolder);
    return saved;
  }
}
