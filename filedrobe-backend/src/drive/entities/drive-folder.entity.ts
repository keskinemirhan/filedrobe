import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DriveFile } from './drive-file.entity';
import { FilePermission } from './file-permission.entity';
import { UserDrive } from './user-drive.entity';

@Entity()
export class DriveFolder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => DriveFile, (file) => file.folder)
  files: DriveFile[];

  @OneToOne(() => FilePermission)
  @JoinColumn()
  permission: FilePermission;

  @ManyToOne(() => UserDrive, (drive) => drive.folders)
  drive: UserDrive;
}
