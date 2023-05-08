import { User } from "../../user/entities/user.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class FilePermission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  accessType: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
