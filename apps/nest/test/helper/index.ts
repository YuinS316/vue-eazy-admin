import { GlobalModule } from '@/modules/global/global.module';
import { DBType } from '@/modules/global/providers/mysql.provider';
import { sql } from 'drizzle-orm';
import { MockRedisModule } from '@test/helper/modckRedis';
import { JwtModule } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { getConfig } from '@/utils/getConfig';

const jwtConfig = getConfig('JWT');

export const testImportModules = [
  GlobalModule,
  MockRedisModule,
  JwtModule.register({
    secret: jwtConfig.secret,
    signOptions: {
      expiresIn: jwtConfig.expiresIn,
      jwtid: nanoid(),
    },
  }),
];

export async function cleanDB(db: DBType) {
  //  关闭外键约束
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);

  const tableNames = [
    'user',
    'profile',
    'permission',
    'role',
    'user_role',
    'role_permission',
  ];

  for (const tableName of tableNames) {
    await db.execute(sql`TRUNCATE TABLE ${sql.raw(tableName)};`);
  }

  //  重新开启外键约束
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
}

export async function startDB(db: DBType) {
  await db.execute(sql`START TRANSACTION;`);
}

export async function endDB(db: DBType) {
  await db.execute(sql`ROLLBACK;`);
}
