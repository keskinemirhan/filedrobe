import { Exclude } from "class-transformer";
import { Profile } from "src/profile/entities/profile.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
  //TODO profile and drive
}
