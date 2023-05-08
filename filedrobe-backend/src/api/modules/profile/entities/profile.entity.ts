import { User } from "../../user/entities/user.entity";
import { UserDrive } from "../../drive/entities/user-drive.entity";

import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @ManyToMany(() => User)
  @JoinTable()
  contacts: User[];

  @OneToOne(() => UserDrive)
  @JoinColumn()
  drive: UserDrive;
}
