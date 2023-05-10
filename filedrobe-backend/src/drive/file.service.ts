import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { DriveService } from "./drive.service";
import { FolderService } from "./folder.service";
import { InjectRepository } from "@nestjs/typeorm";
import { DriveFile } from "./entities/drive-file.entity";
import { Repository } from "typeorm";
import { createReadStream, unlink } from "fs";
import { UserService } from "src/user/user.service";
import { DriveFolder } from "./entities/drive-folder.entity";

@Injectable()
export class FileService {
  constructor(
    @Inject(forwardRef(() => DriveService))
    private driveService: DriveService,
    @Inject(forwardRef(() => FolderService))
    private folderService: FolderService,
    private userService: UserService,
    @InjectRepository(DriveFile) private fileRepo: Repository<DriveFile>,
    @InjectRepository(DriveFolder) private folderRepo: Repository<DriveFolder>
  ) {}
  async uploadFile(file: Express.Multer.File, folderId: string, profile: any) {
    const name = file.originalname;
    const dir = file.destination + "/" + file.filename;
    const drive = await this.driveService.getDriveByProfile(profile.id);
    const folder = await this.folderService.getFolder(folderId, profile);
    const folderFiles = await this.fileRepo.find({ where: { folder } });
    if (folderFiles.some((item) => item.name === name))
      throw new BadRequestException("file name exists");
    const driveFile = this.fileRepo.create({
      name,
      dir,
      drive,
      folder,
    });
    return await this.fileRepo.save(driveFile);
  }

  async getFile(fileId: string, profile: any) {
    const drive = await this.driveService.getDriveByProfile(profile.id);
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
    const drive = await this.driveService.getDriveByProfile(profile.id);
    const files = await this.fileRepo.find({ where: { drive } });
    return files;
  }

  async updateFileContent(
    newFile: Express.Multer.File,
    fileId: string,
    profile: any
  ) {
    const drive = await this.driveService.getDriveByProfile(profile.id);
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
      isPublic?: boolean;
      users: string[];
    }
  ) {
    const drive = await this.driveService.getDriveByProfile(profile.id);
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
        relations: {
          rootFolder: true,
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
    if (options.isPublic !== undefined) {
      file.isPublic = options.isPublic;
    }
    if (options.users.length) {
      const users = [];
      options.users.forEach(async (id) => {
        const user = await this.userService.findById(id);
        users.push(user);
      });
      file.users = users;
    }
    return await this.fileRepo.save(file);
  }

  async deleteFile(fileId: string, profile: any) {
    const drive = await this.driveService.getDriveByProfile(profile.id);
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
    const drive = await this.driveService.getDriveByProfile(profile.id);
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
