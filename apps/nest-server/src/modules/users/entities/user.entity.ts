import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Role } from '@/modules/role/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    unique: true,
    comment: '用户的登录英文名',
  })
  userName: string;

  @Column({
    select: false,
    comment: '用户加密后的密码',
  })
  password: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
  })
  createdOn: Date;

  @Column({
    comment: '创建人的名字',
    nullable: true,
  })
  createdBy: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
  })
  updatedOn: Date;

  @Column({
    comment: '修改人的名字',
    nullable: true,
  })
  updatedBy: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  profile: Profile;

  @ManyToMany(() => Role, (role) => role.users, {
    createForeignKeyConstraints: false,
  })
  @JoinTable()
  roles: Role[];
}
