import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { DriveService } from "./drive.service";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { CreateFolderDto } from "./dto/create-folder.dto";
import { UpdateFolderDto } from "./dto/update-folder.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { UpdateFileDto } from "./dto/update-file.dto";
import { FolderService } from "./folder.service";
import { FileService } from "./file.service";

@Controller("drive")
export class DriveController {
  constructor(
    private driveService: DriveService,
    private folderService: FolderService,
    private fileService: FileService
  ) {}
  //dev
  @Get("all")
  async getAllDrive() {
    return await this.driveService.getAllDrive();
  }

  @UseGuards(AuthGuard)
  @Get()
  async getMyDrive(@Req() req: any) {
    return await this.driveService.getDriveByProfile(req.user.profile.id);
  }

  //folder

  //dev
  @Get("folder/tree")
  async getAllFolderTree() {
    return await this.folderService.getAllFolderTree();
  }

  @UseGuards(AuthGuard)
  @Post("folder")
  async createFolder(
    @Req() req: any,
    @Body() createFolderDto: CreateFolderDto
  ) {
    return await this.folderService.createFolder(
      createFolderDto.name,
      createFolderDto.parentId,
      req.user.profile
    );
  }

  @UseGuards(AuthGuard)
  @Get("folder/:id")
  async getFolder(@Req() req: any, @Param("id") id: string) {
    return await this.folderService.getFolder(id, req.user.profile);
  }

  @UseGuards(AuthGuard)
  @Patch("folder/:id")
  async updateFolder(
    @Req() req: any,
    @Param("id") id: string,
    @Body() updateFolderDto: UpdateFolderDto
  ) {
    return await this.folderService.updateFolder(
      id,
      {
        name: updateFolderDto.name,
        parentId: updateFolderDto.parentId,
      },
      req.user.profile
    );
  }

  @UseGuards(AuthGuard)
  @Delete("folder/:id")
  async deleteFolder(@Req() req: any, @Param("id") id: string) {
    return await this.folderService.deleteFolder(id, req.user.profile);
  }

  //FILE

  @UseGuards(AuthGuard)
  @Get("file/download/:fileId")
  async downloadFile(
    @Res() res: any,
    @Param("fileId") fileId: string,
    @Req() req: any
  ) {
    const file = await this.fileService.streamFile(fileId, req.user.profile);
    file.pipe(res);
  }

  @UseGuards(AuthGuard)
  @Post("upload/:folderId")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./files",
      }),
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Param("folderId") folderId: string
  ) {
    return await this.fileService.uploadFile(file, folderId, req.user.profile);
  }

  @UseGuards(AuthGuard)
  @Get("file/:id")
  async getFile(@Param("id") fileId: string, @Req() req: any) {
    return await this.fileService.getFile(fileId, req.user.profile);
  }

  @UseGuards(AuthGuard)
  @Get("file")
  async getAllFile(@Req() req: any) {
    return await this.fileService.getAllFile(req.user.profile);
  }

  @UseGuards(AuthGuard)
  @Patch("file/content/:id")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./files",
      }),
    })
  )
  async updateFileContent(
    @UploadedFile() newFile: Express.Multer.File,
    @Param("id") fileId: string,
    @Req() req: any
  ) {
    return await this.fileService.updateFileContent(
      newFile,
      fileId,
      req.user.profile
    );
  }

  @UseGuards(AuthGuard)
  @Patch("file/:id")
  async updateFileAttributes(
    @Param("id ") fileId: string,
    @Body() updateFileDto: UpdateFileDto,
    @Req() req: any
  ) {
    return await this.fileService.updateFileAttributes(req.user.profile, {
      fileId,
      newName: updateFileDto.name,
      folderId: updateFileDto.folderId,
      users: updateFileDto.users,
      isPublic: updateFileDto.isPublic,
    });
  }

  @UseGuards(AuthGuard)
  @Delete("file/:id")
  async deleteFile(@Param("id") fileId: string, @Req() req: any) {
    return await this.fileService.deleteFile(fileId, req.user.profile);
  }
}
