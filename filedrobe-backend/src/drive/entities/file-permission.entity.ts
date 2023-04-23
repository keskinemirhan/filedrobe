import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FilePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accessType: number;

  @Column()
  @ManyToMany(() => User)
  users: User[];
}
