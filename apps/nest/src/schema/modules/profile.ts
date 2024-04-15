import { int, mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';
import { User } from '@/schema';

export const Profile = mysqlTable('profile', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  nickName: varchar('nick_name', { length: 255 }).default(''),
  avatarUrl: varchar('avatar_url', { length: 255 }).default(''),
  phone: varchar('phone', { length: 255 }).default(''),
  email: varchar('email', { length: 255 }).default(''),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdOn: timestamp('created_on').defaultNow(),
  updatedBy: varchar('updated_by', { length: 255 }).notNull(),
  updatedOn: timestamp('updated_on').defaultNow().onUpdateNow(),
});

export type ProfileSchema = typeof Profile.$inferInsert;
