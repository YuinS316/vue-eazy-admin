import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { join } from 'path';
import * as fs from 'fs';
import * as dayjs from 'dayjs';

@Injectable()
export class CleanExpireJobService {
  private readonly logger = new Logger(CleanExpireJobService.name);

  //  每天0点删除非当天的日志
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  cleanup() {
    const fileDirectory = join(process.cwd(), 'logs');
    console.log(fileDirectory);

    const todayString = dayjs().format('YYYY-MM-DD');

    const files = fs.readdirSync(fileDirectory);

    const logDateRegx = /^(\d{4}-\d{2}-\d{2})\.\d+\.json$/;

    for (const file of files) {
      if (!file.endsWith('.json')) {
        continue; // 忽略非JSON文件
      }

      const match = file.match(logDateRegx);
      if (!match) {
        continue;
      }

      const dateString = match[1];
      if (dateString === todayString) {
        continue;
      }

      const filePath = join(fileDirectory, file);
      fs.unlinkSync(filePath);
      this.logger.log(`清除过期日志: ${file}`);
    }
  }
}
