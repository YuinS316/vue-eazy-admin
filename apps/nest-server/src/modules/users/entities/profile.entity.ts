import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ comment: '关键的用户表的id', unique: true })
  userId: number;

  @OneToOne(() => User, (user) => user.profile, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @Column({ comment: '用户自定定义的别名', length: 255, default: '' })
  nickName: string;

  @Column({ comment: '头像地址', length: 255, default: '' })
  avatarUrl: string;

  @Column({ comment: '电话号码', length: 255, default: '' })
  phone: string;

  @Column({ comment: '邮箱地址', length: 255, default: '' })
  email: string;

  @Column({ comment: '创建人', length: 255, nullable: true })
  createdBy: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdOn: Date;

  @Column({ comment: '更新人', length: 255, nullable: true })
  updatedBy: string;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updatedOn: Date;
}
