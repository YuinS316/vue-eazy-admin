import { Role } from '@/modules/role/entities/role.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '权限名' })
  code: string;

  @Column({ unique: true, comment: '权限展示名' })
  name: string;

  @Column({ comment: '权限描述' })
  description: string;

  @Column({ comment: '是否启用', default: true })
  enable: boolean;

  @Column({ comment: '创建者', nullable: true })
  createdBy: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdOn: Date;

  @Column({ comment: '最后更新者', nullable: true })
  updatedBy: string;

  @UpdateDateColumn({ comment: '最后更新时间', type: 'timestamp' })
  updatedOn: Date;

  @ManyToMany(() => Role, (role) => role.permissions, {
    createForeignKeyConstraints: false,
  })
  roles: Role[];
}
