import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SCreateUserDto } from "./sdto/s.create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { updateUserDto } from "./dto/update-user.dto";

class UserRelations {
  profile? = false;
}

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  defaultRelations = new UserRelations();

  async createUser(sCreateUserDto: SCreateUserDto): Promise<User> {
    const email = sCreateUserDto.email;
    const username = sCreateUserDto.username;

    const matchEmail = await this.matchByEmail(email);
    if (matchEmail) throw new BadRequestException("Email already exists");
    const matchUsername = await this.matchByUsername(username);
    if (matchUsername) throw new BadRequestException("Username already exists");

    const user = this.repo.create({
      email: sCreateUserDto.email,
      username: sCreateUserDto.username,
      password: sCreateUserDto.password,
      profile: sCreateUserDto.profile,
    });

    const createdUser = await this.repo.save(user);

    return createdUser;
  }

  async findById(id: string, relations = this.defaultRelations): Promise<User> {
    const user = await this.repo.findOne({
      where: { id },
      relations,
    });
    return user;
  }

  async findByEmail(
    email: string,
    relations = this.defaultRelations
  ): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        email,
      },
      relations,
    });
    return user;
  }

  async updateUser(userId: string, updateUserDto: updateUserDto) {
    if (updateUserDto.email) {
      if (await this.matchByEmail(updateUserDto.email))
        throw new BadRequestException("this email is taken");
    }
    if (updateUserDto.username) {
      if (await this.matchByUsername(updateUserDto.username))
        throw new BadRequestException("this username is taken");
    }
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
    const { id, profile, password, ...saved } = await this.repo.save(user);

    return saved;
  }

  async findByUsername(
    username: string,
    relations = this.defaultRelations
  ): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        username,
      },
      relations,
    });
    return user;
  }

  async matchByUsername(username: string): Promise<boolean> {
    return this.repo.exist({ where: { username } });
  }

  async matchByEmail(email: string): Promise<boolean> {
    return this.repo.exist({ where: { email } });
  }

  async getAllUser(): Promise<User[]> {
    const all = await this.repo.find();
    return all;
  }

  async deleteUser(userId: string) {
    const deleted = await this.repo.findOne({ where: { id: userId } });
    this.repo.delete(deleted);
    return deleted;
  }
}
