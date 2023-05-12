import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { DriveFile } from "./drive-file.entity";
import { User } from "src/user/entities/user.entity";

@Entity()
@Tree("closure-table")
export class DriveFolder {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => DriveFile, (file) => file.folder)
  files: DriveFile[];

  @TreeChildren()
  children: DriveFolder[];

  @TreeParent()
  parent: DriveFolder;

  @ManyToOne(() => DriveFolder)
  @JoinColumn()
  rootFolder: DriveFolder;

  @Column({ default: 0 })
  accessType: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
