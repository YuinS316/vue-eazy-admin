import {
  int,
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { PermissionEnum } from '@typings/permission';

export const Permission = mysqlTable('permission', {
  id: int('id').primaryKey().autoincrement(),
  //  父权限的类型
  parentId: int('parentId'),
  //  权限类型
  type: mysqlEnum('type', PermissionEnum),
  //  权限 内部的编号名
  code: varchar('code', { length: 128 }).unique().notNull(),
  //  权限 外部的展示名
  name: varchar('name', { length: 255 }).notNull(),
  //  权限描述
  description: varchar('description', { length: 255 }).default(''),
  //  是否启用
  enable: boolean('enable').default(true),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdOn: timestamp('created_on').defaultNow(),
  updatedBy: varchar('updated_by', { length: 255 }).notNull(),
  updatedOn: timestamp('updated_on').defaultNow().onUpdateNow(),

  //  ==== 菜单 ====
  icon: varchar('menu_icon', { length: 128 }),
  //  菜单路径
  path: varchar('menu_path', { length: 128 }),
  //  重定向路径
  redirect: varchar('menu_redirect', { length: 128 }),
  //  组件的路径
  component: varchar('menu_component', { length: 128 }),
  //  使用的layout
  layout: varchar('menu_layout', { length: 128 }),
  //  是否使用keepAlive
  keepAlive: boolean('menu_keepAlive').default(true),
  //  是否展示在菜单
  show: boolean('menu_show').default(true),
  //  越大排的越后
  order: int('menu_order').default(0),

  //  ==== 按钮 ====

  //  ==== api ====
});

export type PermissionSchema = typeof Permission.$inferInsert;
