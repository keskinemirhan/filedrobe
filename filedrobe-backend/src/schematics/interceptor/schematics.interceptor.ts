import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { DriveService } from "src/drive/drive.service";

export class SchematicsInterceptor implements NestInterceptor {
  constructor(private driveService: DriveService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest();
    const profile = req.user.profile;
    const drive = await this.driveService.getDriveByProfileId(profile.id);
    req["drive"] = drive;
    return next.handle();
  }
}
