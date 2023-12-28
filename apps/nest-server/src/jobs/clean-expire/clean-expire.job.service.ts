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
      // 忽略非JSON文件
      if (!file.endsWith('.json')) {
        continue;
      }

      const match = file.match(logDateRegx);
      //  忽略非标准格式的日志
      if (!match) {
        continue;
      }

      const dateString = match[1];
      //  忽略当天的日志
      if (dateString === todayString) {
        continue;
      }

      //  删除非当天的日志
      const filePath = join(fileDirectory, file);
      fs.unlinkSync(filePath);
      this.logger.log(`清除过期日志: ${file}`);
    }
  }
}
