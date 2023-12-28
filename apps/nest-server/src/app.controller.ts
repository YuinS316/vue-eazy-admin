import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { BusinessThrownService } from './common/providers/businessThrown/businessThrown.provider';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly businessThrownService: BusinessThrownService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello')
  hello(): string {
    return 'hello boy 123';
  }

  @Get('forbidden')
  throwForbidden() {
    return this.businessThrownService.throwNoLogin();
  }

  @Get('getConfig')
  config() {
    return this.configService.get('TEST_VALUE')?.name;
  }
}
