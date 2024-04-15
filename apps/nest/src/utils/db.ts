import { getConfig } from '@/utils/getConfig';
import * as schemas from '@/schema';
import { Logger } from '@nestjs/common';
import { DefaultLogger, LogWriter } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';
import {
  createConnection,
  ConnectionOptions,
  Connection,
} from 'mysql2/promise';

const mysqlConfig: ConnectionOptions = getConfig('MYSQL_CONFIG');

let connection: Connection;

export async function setupCreation() {
  return createConnection(mysqlConfig);
}

export async function endConnection() {
  if (connection) {
    await connection.end();
    connection = null;
  }
}

export async function setupDB() {
  //  保持单例
  if (connection) {
    return;
  }

  const logger = new Logger('Database');

  class CustomDbLogWriter implements LogWriter {
    write(message: string) {
      logger.debug(message);
    }
  }

  logger.debug('connecting mysql ...');
  logger.debug('mysql config check ===>', mysqlConfig);

  connection = await setupCreation();
  return drizzle(connection, {
    schema: schemas,
    logger: new DefaultLogger({ writer: new CustomDbLogWriter() }),
    mode: 'planetscale',
  });
}
