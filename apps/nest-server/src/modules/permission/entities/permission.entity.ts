import { Role } from '@/modules/role/entities/role.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PermissionType } from '@/types/permission';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, comment: '父权限的id' })
  parentId: number;

  @ManyToOne(() => Permission, (permission) => permission.children, {
    createForeignKeyConstraints: false,
  })
  parent: Permission;

  @OneToMany(() => Permission, (permission) => permission.parent, {
    createForeignKeyConstraints: false,
  })
  children: Permission[];

  @Column({
    comment: '权限类型',
  })
  type: PermissionType;

  @Column({ unique: true, comment: '权限名' })
  code: string;

  @Column({ unique: true, comment: '权限展示名' })
  name: string;

  @Column({ comment: '权限描述' })
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

  @ManyToMany(() => Role, (role) => role.permissions, {
    createForeignKeyConstraints: false,
  })
  roles: Role[];

  //  ==== 菜单 ===
  @Column({ nullable: true, comment: 'icon' })
  icon: string;

  @Column({ nullable: true, comment: '菜单的路径' })
  path: string;

  @Column({ nullable: true, comment: '重定向的路径' })
  redirect: string;

  @Column({ nullable: true, comment: '组件的路径' })
  component: string;

  @Column({ nullable: true, comment: '使用的layout' })
  layout: string;

  @Column({ nullable: true, comment: '是否使用keepAlive' })
  keepAlive: boolean;

  @Column({ default: true, comment: '是否展示在菜单' })
  show: boolean;

  @Column({ nullable: true, comment: '越大排的越后' })
  order: number;

  //  ==== 按钮 ====

  //  ==== api ====
}
