import {
  BadRequestException,
  Inject,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { DriveService } from "./drive.service";
import { InjectRepository } from "@nestjs/typeorm";
import { DriveFolder } from "./entities/drive-folder.entity";
import { Repository, TreeRepository } from "typeorm";

class FolderRelations {
  files? = false;
  children? = false;
  parent? = false;
  rootFolder? = false;
  users? = false;
}

export class FolderService {
  constructor(
    @Inject(forwardRef(() => DriveService))
    private driveService: DriveService,
    @InjectRepository(DriveFolder) private folderRepo: Repository<DriveFolder>,
    @InjectRepository(DriveFolder)
    private folderTreeRepo: TreeRepository<DriveFolder>
  ) {}

  defaultRelations = new FolderRelations();
  async createRootFolder() {
    const rootFolder = await this.folderRepo.create({ name: "root" });
    const saved = await this.folderRepo.save(rootFolder);
    return saved;
  }

  async getFolderById(folderId: string, relations = this.defaultRelations) {
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
    const drive = await this.driveService.getDriveByProfileId(profile.id);
    const rootFolder = drive.rootFolder;
    if (parent.rootFolder) {
      if (!(parent.rootFolder.id === rootFolder.id))
        throw new NotFoundException(`folder with id ${parent.id} not found`);
    } else if (!(rootFolder.id === parent.id))
      throw new NotFoundException(`folder with id ${parent.id} not found`);
    const folder = this.folderRepo.create({ name, rootFolder, parent });
    return await this.folderRepo.save(folder);
  }

  async getFolder(id: string, profile: any, relations = this.defaultRelations) {
    const folder = await this.folderRepo.findOne({
      where: { id },
      relations: {
        rootFolder: true,
      },
    });
    const drive = await this.driveService.getDriveByProfileId(profile.id);

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
    const drive = await this.driveService.getDriveByProfileId(profile.id);
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
    const drive = await this.driveService.getDriveByProfileId(profile.id);
    if (!folder)
      throw new BadRequestException(`folder with id ${id} not found`);
    if (folder.id === drive.rootFolder.id)
      throw new BadRequestException(`cannot delete root folder`);
    if (folder.rootFolder !== drive.rootFolder)
      throw new BadRequestException(`folder with id ${id} not found`);

    return await this.folderRepo.remove(folder);
  }
}
