import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DriveFolder } from './drive-folder.entity';
import { FilePermission } from './file-permission.entity';
import { UserDrive } from './user-drive.entity';

@Entity()
export class DriveFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dir: string;

  @Column()
  name: string;

  @ManyToOne(() => DriveFolder, (folder) => folder.files)
  folder: DriveFolder;

  @OneToOne(() => FilePermission)
  @JoinColumn()
  permission: FilePermission;

  @ManyToOne(() => UserDrive, (drive) => drive.files)
  drive: UserDrive;
}
