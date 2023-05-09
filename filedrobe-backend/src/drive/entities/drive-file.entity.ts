import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DriveFolder } from "./drive-folder.entity";
import { UserDrive } from "./user-drive.entity";
import { User } from "src/user/entities/user.entity";

@Entity()
export class DriveFile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  dir: string;

  @Column()
  name: string;

  @ManyToOne(() => DriveFolder, (folder) => folder.files)
  folder: DriveFolder;

  @Column({ default: 0 })
  accessType: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToOne(() => UserDrive, (drive) => drive.files)
  drive: UserDrive;
}
