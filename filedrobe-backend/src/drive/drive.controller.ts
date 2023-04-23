import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DriveService } from './drive.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

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
}
