import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "./entities/profile.entity";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { User } from "src/user/entities/user.entity";
import { UserDrive } from "src/drive/entities/user-drive.entity";

class ProfileRelations {
  drive? = false;
  contacts? = false;
}

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private repo: Repository<Profile>,
    private userService: UserService
  ) {}

  defaultRelations = new ProfileRelations();

  async createProfile(drive: UserDrive) {
    const profile = this.repo.create({ drive });
    return await this.repo.save(profile);
  }

  async getProfileById(profileId: string, relations = this.defaultRelations) {
    const myProfile = await this.repo.findOne({
      where: {
        id: profileId,
      },
      relations,
    });

    return myProfile;
  }

  async getProfileByUsername(
    username: string,
    relations = this.defaultRelations
  ) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new NotFoundException("profile not found");
    const profile = await this.repo.findOne({
      where: { id: user.profile.id },
      relations,
    });

    return profile;
  }

  async updateProfile(profileId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.repo.findOne({
      where: {
        id: profileId,
      },
    });
    if (updateProfileDto.contacts) {
      const { contacts, ...profileAttr } = updateProfileDto;
      Object.assign(profile, profileAttr);
      profile.contacts = [];
      contacts.forEach(async (username: string) => {
        const user = await this.userService.findByUsername(username);
        if (!user)
          throw new BadRequestException(
            `user with username ${user.username} does not exist`
          );
        profile.contacts.push(user);
      });

      Object.assign(profile, profileAttr);
      const updated = await this.repo.save(profile);
      updated.contacts.forEach((user: User) => {
        user.id = undefined;
        user.password = undefined;
        user.profile = undefined;
      });
      return updated;
    }
    Object.assign(profile, updateProfileDto);
    return await this.repo.save(profile);
  }
  async deleteProfile(profileId: string, userId: string) {
    const deletedUser = await this.userService.deleteUser(userId);
    await this.repo.delete(profileId);
    return;
  }
}
