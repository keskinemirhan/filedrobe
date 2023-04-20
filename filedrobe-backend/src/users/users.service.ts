import { BadRequestException, Injectable } from '@nestjs/common';
import { SCreateUserDto } from './sdto/s.create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(sCreateUserDto: SCreateUserDto): Promise<User> {
    const email = sCreateUserDto.email;
    const username = sCreateUserDto.username;

    const matchEmail = await this.matchByEmail(email);
    if (matchEmail) throw new BadRequestException('Email already exists');
    const matchUsername = await this.matchByUsername(username);
    if (matchUsername) throw new BadRequestException('Username already exists');

    const user = this.repo.create(sCreateUserDto);
    const createdUser = await this.repo.save(user);

    return createdUser;
  }

  async findById(id: string, included: boolean): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async findByUsername(username: string, included: boolean): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        username,
      },
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
}
