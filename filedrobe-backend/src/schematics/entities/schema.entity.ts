import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Group } from "./group.entity";
import { Tag } from "./tag.entity";
import { UserDrive } from "src/drive/entities/user-drive.entity";

@Entity()
export class Schema {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Group, (group) => group.schema)
  groups: Group[];

  @ManyToMany(() => Tag)
  tags: Tag[];

  @ManyToOne(() => UserDrive, (drive) => drive.schemas)
  drive: UserDrive;
}
