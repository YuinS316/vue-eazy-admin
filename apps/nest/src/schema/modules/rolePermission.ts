import {
  int,
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

//  角色 - 权限关系表
export const RolePermission = mysqlTable('role_permission', {
  id: int('id').primaryKey().autoincrement(),
  roleId: int('role_id').notNull(),
  permissionId: int('permission_id').notNull(),

  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdOn: timestamp('created_on').defaultNow(),
  updatedBy: varchar('updated_by', { length: 255 }).notNull(),
  updatedOn: timestamp('updated_on').defaultNow().onUpdateNow(),
});

export type RolePermissionSchema = typeof RolePermission.$inferInsert;
