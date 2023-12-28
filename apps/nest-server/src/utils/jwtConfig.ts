import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { nanoid } from 'nanoid';

export function jwtConfig(): JwtModuleAsyncOptions {
  return {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      return {
        secret: configService.get('JWT').secret,
        signOptions: {
          expiresIn: configService.get('JWT').expiresIn,
          jwtid: nanoid(),
        },
      };
    },
    inject: [ConfigService],
  };
}
