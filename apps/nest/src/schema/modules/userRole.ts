import {
  int,
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

//  用户 - 角色关系表
export const UserRole = mysqlTable('user_role', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  roleId: int('role_id').notNull(),

  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdOn: timestamp('created_on').defaultNow(),
  updatedBy: varchar('updated_by', { length: 255 }).notNull(),
  updatedOn: timestamp('updated_on').defaultNow().onUpdateNow(),
});

export type UserRoleSchema = typeof UserRole.$inferInsert;
