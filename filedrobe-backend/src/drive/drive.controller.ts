import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";

@Controller("drive")
export class DriveController {
  constructor(private driveService: DriveService) {}
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
    return await this.driveService.getAllFolderTree();
  }

  @UseGuards(AuthGuard)
  @Post("folder")
  async createFolder(
    @Req() req: any,
    @Body() createFolderDto: CreateFolderDto
  ) {
    return await this.driveService.createFolder(
      createFolderDto.name,
      createFolderDto.parentId,
      req.user.profile
    );
  }

  @UseGuards(AuthGuard)
  @Get("folder/:id")
  async getFolder(@Req() req: any, @Param("id") id: string) {
    return await this.driveService.getFolder(id, req.user.profile);
  }

  @UseGuards(AuthGuard)
  @Patch("folder/:id")
  async updateFolder(
    @Req() req: any,
    @Param("id") id: string,
    @Body() updateFolderDto: UpdateFolderDto
  ) {
    return await this.driveService.updateFolder(
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
    return await this.driveService.deleteFolder(id, req.user.profile);
  }

  //FILE

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
    return await this.driveService.uploadFile(file, folderId, req.user.profile);
  }

  @UseGuards(AuthGuard)
  @Get("file/:id")
  async getFile(@Param("id") fileId: string, @Req() req: any) {
    return await this.driveService.getFile(fileId, req.user.profile);
  }

  @UseGuards(AuthGuard)
  @Get("file")
  async getAllFile(@Req() req: any) {
    return await this.driveService.getAllFile(req.user.profile);
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
    return await this.driveService.updateFileContent(
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
    return await this.driveService.updateFileAttributes(req.user.profile, {
      newName: updateFileDto.name,
      folderId: updateFileDto.folderId,
    });
  }

  @UseGuards(AuthGuard)
  @Delete("file/:id")
  async deleteFile(@Param("id") fileId: string, @Req() req: any) {
    return await this.driveService.deleteFile(fileId, req.user.profile);
  }
}