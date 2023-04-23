import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DriveFile } from './drive-file.entity';
import { FilePermission } from './file-permission.entity';

@Entity()
export class DriveFolder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @OneToMany(() => DriveFile, (file) => file.folder)
  files: DriveFile[];

  @OneToOne(() => FilePermission)
  @JoinColumn()
  permission: FilePermission;
}
