import {
  int,
  mysqlTable,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/mysql-core';

export const Role = mysqlTable('role', {
  id: int('id').primaryKey().autoincrement(),
  code: varchar('code', { length: 128 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  //  权限描述
  description: varchar('description', { length: 255 }).default(''),
  //  是否启用
  enable: boolean('enable').default(true),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdOn: timestamp('created_on').defaultNow(),
  updatedBy: varchar('updated_by', { length: 255 }).notNull(),
  updatedOn: timestamp('updated_on').defaultNow().onUpdateNow(),
});

export type RoleSchema = typeof Role.$inferInsert;
