import type { Config } from 'drizzle-kit';
import { getConfig } from '@/utils/getConfig';

const { host, port, user, password, database } = getConfig(
  'MYSQL_CONFIG',
  'dev',
);

export default {
  schema: './src/schema/modules/*',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host,
    port,
    user,
    password,
    database,
  },
} satisfies Config;
