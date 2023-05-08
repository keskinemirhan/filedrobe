import { UserDrive } from "../../drive/entities/user-drive.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column()
  description: string;

  @ManyToOne(() => UserDrive, (drive) => drive.tags)
  drive: UserDrive;
}
