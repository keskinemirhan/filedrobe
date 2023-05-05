import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DriveService } from './drive.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller('drive')
export class DriveController {
  constructor(private driveService: DriveService) {}
  //dev
  @Get('all')
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
  @Get('folder/tree')
  async getAllFolderTree() {
    return await this.driveService.getAllFolderTree();
  }

  @UseGuards(AuthGuard)
  @Post('folder')
  async createFolder(
    @Req() req: any,
    @Body() createFolderDto: CreateFolderDto,
  ) {
    return await this.driveService.createFolder(
      createFolderDto.name,
      createFolderDto.parentId,
      req.user.profile,
    );
  }

  @Get('folder/:id')
  async getFolder(@Param('id') id: string) {
    return await this.driveService.getFolderById(id);
  }

  @UseGuards(AuthGuard)
  @Patch('folder/:id')
  async updateFolder(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    return await this.driveService.updateFolder(
      id,
      {
        name: updateFolderDto.name,
        parentId: updateFolderDto.parentId,
      },
      req.user.profile,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('folder/:id')
  async deleteFolder(@Req() req: any, @Param('id') id: string) {
    return await this.driveService.deleteFolder(id, req.user.profile);
  }
}
