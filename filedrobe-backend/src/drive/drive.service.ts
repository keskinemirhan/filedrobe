import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDrive } from './entities/user-drive.entity';
import { Repository, TreeRepository } from 'typeorm';
import { ProfileService } from 'src/profile/profile.service';
import { DriveFolder } from './entities/drive-folder.entity';

@Injectable()
export class DriveService {
  constructor(
    @InjectRepository(UserDrive) private driveRepo: Repository<UserDrive>,
    @InjectRepository(DriveFolder) private folderRepo: Repository<DriveFolder>,
    @InjectRepository(DriveFolder)
    private folderTreeRepo: TreeRepository<DriveFolder>,
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

  async getFolderById(folderId: string) {
    const folder = await this.folderRepo.findOne({
      where: { id: folderId },
      relations: {
        rootFolder: true,
      },
    });
    return folder;
  }

  async getAllFolderTree() {
    const tree = await this.folderTreeRepo.findTrees();
    return tree;
  }

  async createFolder(name: string, parentId: string, profile: any) {
    const parent = await this.getFolderById(parentId);
    const drive = await this.getDriveByProfile(profile.id);
    const rootFolder = drive.rootFolder;
    if (parent.rootFolder) {
      if (!(parent.rootFolder.id === rootFolder.id))
        throw new NotFoundException(`folder with id ${parent.id} not found`);
    } else if (!(rootFolder.id === parent.id))
      throw new NotFoundException(`folder with id ${parent.id} not found`);
    const folder = this.folderRepo.create({ name, rootFolder, parent });
    return await this.folderRepo.save(folder);
  }

  async getFolder(id: string) {
    const folder = await this.folderRepo.findOne({ where: { id } });
    return folder;
  }

  async updateFolder(
    id: string,
    args: { name?: string; parentId?: string },
    profile: any,
  ) {
    const drive = await this.getDriveByProfile(profile.id);
    const folder = await this.folderRepo.findOne({
      where: { id },
      relations: {
        rootFolder: true,
      },
    });
    if (!folder)
      throw new BadRequestException(`folder with id ${id} not found`);
    if (folder.rootFolder.id !== drive.rootFolder.id)
      throw new BadRequestException(`folder with id ${id} not found`);

    if (args.name) folder.name = args.name;
    if (args.parentId) {
      const parent = await this.folderRepo.findOne({
        where: { id: args.parentId },
      });
      if (!parent)
        throw new BadRequestException(
          `folder with given id ${args.parentId} not found`,
        );
      if (parent.id !== drive.rootFolder.id) {
        if (parent.rootFolder !== drive.rootFolder)
          throw new BadRequestException(
            `folder with given id ${args.parentId} not found`,
          );
      }
      folder.parent = parent;
      return await this.folderRepo.save(folder);
    }
  }

  async deleteFolder(id: string, profile: any) {
    const folder = await this.folderRepo.findOne({
      where: {
        id,
      },
    });
    const drive = await this.getDriveByProfile(profile.id);
    if (!folder)
      throw new BadRequestException(`folder with id ${id} not found`);
    if (folder.id === drive.rootFolder.id)
      throw new BadRequestException(`cannot delete root folder`);
    if (folder.rootFolder !== drive.rootFolder)
      throw new BadRequestException(`folder with id ${id} not found`);

    return await this.folderRepo.remove(folder);
  }
}
