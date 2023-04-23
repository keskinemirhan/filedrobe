import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DriveFile } from './drive-file.entity';
import { DriveFolder } from './drive-folder.entity';
import { Schema } from 'src/schematics/entities/schema.entity';
import { Tag } from 'src/schematics/entities/tag.entity';

@Entity()
export class UserDrive {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Tag, (tag) => tag.drive)
  tags: Tag[];

  @OneToMany(() => DriveFile, (file) => file.drive, { eager: true })
  files: DriveFile[];

  @OneToMany(() => DriveFolder, (folder) => folder.drive, { eager: true })
  folders: DriveFolder[];

  @OneToMany(() => Schema, (schema) => schema.drive)
  schemas: Schema[];
}
