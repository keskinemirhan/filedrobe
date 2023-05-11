import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tag } from "./tag.entity";
import { Schema } from "./schema.entity";

@Entity()
export class Group {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Schema)
  schema: Schema;

  @ManyToMany(() => Tag)
  @JoinColumn()
  tags: Tag[];
}
