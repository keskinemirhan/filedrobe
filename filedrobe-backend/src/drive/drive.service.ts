import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDrive } from "./entities/user-drive.entity";
import { Repository } from "typeorm";
import { ProfileService } from "src/profile/profile.service";
import { DriveFolder } from "./entities/drive-folder.entity";
import { FolderService } from "./folder.service";

class DriveRelations {
  tags? = false;
  files? = false;
  rootFolder? = false;
  schemas? = false;
}

@Injectable()
export class DriveService {
  constructor(
    @Inject(forwardRef(() => FolderService))
    private folderService: FolderService,
    @InjectRepository(UserDrive) private driveRepo: Repository<UserDrive>,
    private profileService: ProfileService
  ) {}

  defaultRelations = new DriveRelations();
  //dev
  async getAllDrive(relations = this.defaultRelations) {
    return await this.driveRepo.find({ relations });
  }

  async getDriveById(driveId: string, relations = this.defaultRelations) {
    const drive = await this.driveRepo.findOne({
      where: { id: driveId },
      relations,
    });
    return drive;
  }

  async getDriveByProfileId(
    profileId: string,
    relations = this.defaultRelations
  ) {
    const profile = await this.profileService.getProfileById(profileId, {
      drive: true,
    });
    const drive = await this.driveRepo.findOne({
      where: { id: profile.drive.id },
      relations,
    });
    return drive;
  }

  async createDrive() {
    const drive = await this.driveRepo.create();
    const rootFolder = await this.folderService.createRootFolder();
    drive.rootFolder = rootFolder;
    return this.driveRepo.save(drive);
  }
}
