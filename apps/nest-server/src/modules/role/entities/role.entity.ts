import { Permission } from '@/modules/permission/entities/permission.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '角色名' })
  code: string;

  @Column({ unique: true, comment: '角色展示名' })
  name: string;

  @Column({ comment: '角色描述', nullable: true })
  description: string;

  @Column({ comment: '是否启用', default: true })
  enable: boolean;

  @Column({ comment: '创建者' })
  createdBy: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdOn: Date;

  @Column({ comment: '最后更新者' })
  updatedBy: string;

  @UpdateDateColumn({ comment: '最后更新时间', type: 'timestamp' })
  updatedOn: Date;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    createForeignKeyConstraints: false,
  })
  @JoinTable()
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles, {
    createForeignKeyConstraints: false,
  })
  users: User[];
}
