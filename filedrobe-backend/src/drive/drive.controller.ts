import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DriveService } from './drive.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { CreateFolderDto } from './dto/create-folder.dto';

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
}
