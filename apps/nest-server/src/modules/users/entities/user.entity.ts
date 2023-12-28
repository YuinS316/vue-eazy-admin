import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    comment: '用户的登录英文名',
  })
  userName: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
  })
  createdOn: Date;

  @Column({
    comment: '创建人的名字',
    default: 'system',
  })
  createdBy: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
  })
  updatedOn: Date;

  @Column({
    comment: '修改人的名字',
    default: 'system',
  })
  updatedBy: string;
}
