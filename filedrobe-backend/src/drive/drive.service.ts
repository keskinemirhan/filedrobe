import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDrive } from "./entities/user-drive.entity";
import { Repository, TreeRepository } from "typeorm";
import { ProfileService } from "src/profile/profile.service";
import { DriveFolder } from "./entities/drive-folder.entity";
import { DriveFile } from "./entities/drive-file.entity";
import { createReadStream, unlink } from "fs";

@Injectable()
export class DriveService {
  constructor(
    @InjectRepository(UserDrive) private driveRepo: Repository<UserDrive>,
    @InjectRepository(DriveFolder) private folderRepo: Repository<DriveFolder>,
    @InjectRepository(DriveFolder)
    private folderTreeRepo: TreeRepository<DriveFolder>,
    @InjectRepository(DriveFile) private fileRepo: Repository<DriveFile>,
    private profileService: ProfileService
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
    const rootFolder = await this.folderRepo.create({ name: "root" });
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

  async getFolder(id: string, profile: any) {
    const folder = await this.folderRepo.findOne({
      where: { id },
      relations: {
        rootFolder: true,
      },
    });
    const drive = await this.getDriveByProfile(profile.id);

    if (!folder)
      throw new BadRequestException(`folder with id ${id} not found`);
    if (folder.id !== drive.rootFolder.id) {
      if (folder.rootFolder.id !== drive.rootFolder.id)
        throw new BadRequestException(`folder with id ${id} not found`);
    }
    return folder;
  }

  async updateFolder(
    id: string,
    args: { name?: string; parentId?: string },
    profile: any
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
          `folder with given id ${args.parentId} not found`
        );
      if (parent.id !== drive.rootFolder.id) {
        if (parent.rootFolder !== drive.rootFolder)
          throw new BadRequestException(
            `folder with given id ${args.parentId} not found`
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

  //FILE

  async uploadFile(file: Express.Multer.File, folderId: string, profile: any) {
    const name = file.originalname;
    const dir = file.destination + "/" + file.filename;
    const drive = await this.getDriveByProfile(profile.id);
    const folder = await this.getFolder(folderId, profile);
    const folderFiles = await this.fileRepo.find({ where: { folder } });
    if (folderFiles.length) throw new BadRequestException("file name exists");
    const driveFile = this.fileRepo.create({ name, dir, drive, folder });
    return await this.fileRepo.save(driveFile);
  }

  async getFile(fileId: string, profile: any) {
    const drive = await this.getDriveByProfile(profile.id);
    const file = await this.fileRepo.findOne({
      where: {
        id: fileId,
        drive,
      },
    });
    if (!file)
      throw new BadRequestException(`file with id ${fileId} not found `);
    return file;
  }

  async getAllFile(profile: any) {
    const drive = await this.getDriveByProfile(profile.id);
    const files = await this.fileRepo.find({ where: { drive } });
    return files;
  }

  async updateFileContent(
    newFile: Express.Multer.File,
    fileId: string,
    profile: any
  ) {
    const drive = await this.getDriveByProfile(profile.id);
    const oldFile = await this.fileRepo.findOne({
      where: { id: fileId, drive },
    });
    if (!oldFile)
      throw new BadRequestException(`file with  ${fileId} does not exist`);
    const oldDir = oldFile.dir;
    await unlink(oldDir, () => {});
    const newDir = newFile.destination + "/" + newFile.filename;
    oldFile.dir = newDir;
    return await this.fileRepo.save(oldFile);
  }

  async updateFileAttributes(
    profile: any,
    options: {
      fileId?: string;
      newName?: string;
      folderId?: string;
    }
  ) {
    const drive = await this.getDriveByProfile(profile.id);
    const file = await this.fileRepo.findOne({
      where: {
        id: options.fileId,
        drive,
      },
    });
    if (!file)
      throw new BadRequestException(`file with id ${options.fileId} not found`);
    if (options.folderId) {
      const folder = await this.folderRepo.findOne({
        where: {
          id: options.folderId,
        },
      });
      if (folder.rootFolder.id !== drive.rootFolder.id)
        throw new BadRequestException(
          `folder with id ${options.folderId} not found`
        );
      file.folder = folder;
    }
    if (options.newName) {
      file.name = options.newName;
    }
    return await this.fileRepo.save(file);
  }

  async deleteFile(fileId: string, profile: any) {
    const drive = await this.getDriveByProfile(profile.id);
    const file = await this.fileRepo.findOne({
      where: {
        id: fileId,
        drive,
      },
    });
    if (!file)
      throw new BadRequestException(`file with id ${fileId} not found`);
    await unlink(file.dir, () => {});
    return await this.fileRepo.remove(file);
  }

  async streamFile(fileId: string, profile: any) {
    const drive = await this.getDriveByProfile(profile.id);
    const file = await this.fileRepo.findOne({
      where: {
        id: fileId,
        drive,
      },
    });
    if (!file) throw new BadRequestException(`file with id ${fileId}`);
    return createReadStream(file.dir);
  }
}
