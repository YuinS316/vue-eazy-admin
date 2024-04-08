import * as schemas from '@/schema';
import { FactoryProvider } from '@nestjs/common';
import { type MySql2Database } from 'drizzle-orm/mysql2';
import { setupDB } from '@/utils/db';

export const DB = Symbol('db');
export type DBType = MySql2Database<typeof schemas>;
export const DBProvider: FactoryProvider<DBType> = {
  provide: DB,
  async useFactory() {
    return setupDB();
  },
};
