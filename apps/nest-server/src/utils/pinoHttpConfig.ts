import { join } from 'path';
import pino, { multistream, Level } from 'pino';
import pretty from 'pino-pretty';
import * as dayjs from 'dayjs';
import { Params } from 'nestjs-pino';

export function pinoHttpConfig(): Params {
  return {
    pinoHttp: [
      {},
      multistream(
        [
          // 控制台输出
          ...(['info', 'debug', 'warn', 'error', 'fatal'] as Level[]).map(
            (level) => ({
              level,
              stream: process.stdout.pipe(pretty()),
            }),
          ),
          // 写入日志
          ...(['error', 'fatal'] as Level[]).map((level) => ({
            level,
            stream: pino.transport({
              target: 'pino-roll',
              options: {
                file: join('logs', dayjs().format('YYYY-MM-DD')),
                frequency: 'daily',
                mkdir: true,
                size: '5m',
                extension: '.json',
              },
            }),
          })),
        ],
        { dedupe: true },
      ),
    ],
  };
}
