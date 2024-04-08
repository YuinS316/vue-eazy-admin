import {
  int,
  mysqlTable,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const User = mysqlTable('user', {
  id: int('id').primaryKey().autoincrement(),
  // 是否启用
  enable: boolean('enable').default(true),
  // 用户的登录英文名
  userName: varchar('user_name', { length: 128 }).unique().notNull(),
  // 用户加密后的密码
  password: varchar('password', { length: 255 }).notNull(),
  // 创建时间
  createdOn: timestamp('created_on').defaultNow(),
  // 创建人的名字
  createdBy: varchar('created_by', { length: 128 }).notNull(),
  // 更新时间
  updatedOn: timestamp('updated_on').defaultNow().onUpdateNow(),
  // 修改人的名字
  updatedBy: varchar('updated_by', { length: 128 }).notNull(),
});

export type UserSchema = typeof User.$inferInsert;
