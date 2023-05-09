import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { DriveFile } from "./drive-file.entity";
import { FilePermission } from "./file-permission.entity";

@Entity()
@Tree("closure-table")
export class DriveFolder {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => DriveFile, (file) => file.folder, { eager: true })
  files: DriveFile[];

  @TreeChildren()
  children: DriveFolder[];

  @TreeParent()
  parent: DriveFolder;

  @ManyToOne(() => DriveFolder)
  @JoinColumn()
  rootFolder: DriveFolder;

  @OneToOne(() => FilePermission)
  @JoinColumn()
  permission: FilePermission;
}
