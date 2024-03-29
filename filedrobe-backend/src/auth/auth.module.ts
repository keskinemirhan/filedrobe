import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/user/user.module';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { DriveModule } from 'src/drive/drive.module';

@Module({
  providers: [AuthService, AuthGuard],
  imports: [
    DriveModule,
    ProfileModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'devsecret',
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  exports: [AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
