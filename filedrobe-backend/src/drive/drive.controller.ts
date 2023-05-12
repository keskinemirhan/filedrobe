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
import { Profile } from "src/profile/decorators/profile.decorator";
import { QueryFileDto } from "./dto/query-file.dto";
import { QueryFolderDto } from "./dto/query-folder.dto";
import { QueryDriveDto } from "./dto/query-drive.dto";

@UseGuards(AuthGuard)
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

  @Get()
  async getMyDrive(@Body() queryDriveDto: QueryDriveDto, @Req() req: any) {
    return await this.driveService.getDriveByProfileId(
      req.user.profile.id,
      queryDriveDto
    );
  }

  //folder

  //dev
  @Get("folder/tree")
  async getAllFolderTree() {
    return await this.folderService.getAllFolderTree();
  }

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

  @Get("folder/:id")
  async getFolder(
    @Body() queryFolderDto: QueryFolderDto,
    @Profile() profile: any,
    @Param("id") id: string
  ) {
    return await this.folderService.getFolder(id, profile, queryFolderDto);
  }

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

  @Delete("folder/:id")
  async deleteFolder(@Profile() profile: any, @Param("id") id: string) {
    return await this.folderService.deleteFolder(id, profile);
  }

  //FILE

  @Get("file/download/:fileId")
  async downloadFile(
    @Res() res: any,
    @Param("fileId") fileId: string,
    @Profile() profile: any
  ) {
    const file = await this.fileService.streamFile(fileId, profile);
    file.pipe(res);
  }

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
    @Profile() profile: any,
    @Param("folderId") folderId: string
  ) {
    return await this.fileService.uploadFile(file, folderId, profile);
  }

  @Get("file/:id")
  async getFile(
    @Body() queryFileDto: QueryFileDto,
    @Param("id") fileId: string,
    @Profile() profile: any
  ) {
    return await this.fileService.getFile(fileId, profile, queryFileDto);
  }

  @Get("file")
  async getAllFile(
    @Body() queryFileDto: QueryFileDto,
    @Profile() profile: any
  ) {
    return await this.fileService.getAllFile(profile, queryFileDto);
  }

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
    @Profile() profile: any
  ) {
    return await this.fileService.updateFileContent(newFile, fileId, profile);
  }

  @Patch("file/:id")
  async updateFileAttributes(
    @Param("id ") fileId: string,
    @Body() updateFileDto: UpdateFileDto,
    @Profile() profile: any
  ) {
    return await this.fileService.updateFileAttributes(profile, {
      fileId,
      newName: updateFileDto.name,
      folderId: updateFileDto.folderId,
      users: updateFileDto.users,
      isPublic: updateFileDto.isPublic,
    });
  }

  @Delete("file/:id")
  async deleteFile(@Param("id") fileId: string, @Profile() profile: any) {
    return await this.fileService.deleteFile(fileId, profile);
  }
}
