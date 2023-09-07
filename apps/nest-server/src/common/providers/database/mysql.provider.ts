import { DataSource } from 'typeorm';
import { getConfig } from '@/utils/config';
import { join } from 'path';

const { MYSQL_CONFIG } = getConfig();

const MYSQL_DATABASE_CONFIG = {
  ...MYSQL_CONFIG,
  migrations: [],
  subscribers: [],
  type: 'mysql',
  connectorPackage: 'mysql2',
  entities: [join(__dirname, `../../../modules/**/*.entity{.ts,.js}`)],
};

const MYSQL_DATA_SOURCE = new DataSource(MYSQL_DATABASE_CONFIG);

export const MysqlProvider = {
  provide: 'MYSQL',
  useFactory: async () => {
    await MYSQL_DATA_SOURCE.initialize();
    return MYSQL_DATA_SOURCE;
  },
};
