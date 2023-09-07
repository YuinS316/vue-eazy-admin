import { BusinessFilter } from '@/common/exceptions/business/business.filter';
import { Injectable } from '@nestjs/common';
import { BUSINESS_ERROR_CODE } from '@/common/providers/businessThrown/business.code.enum';

@Injectable()
export class BusinessThrownService {
  constructor() {}

  throwCommon(message: string) {
    throw new BusinessFilter({
      code: BUSINESS_ERROR_CODE.COMMON,
      message,
    });
  }

  throwNoLogin(message = '用户没有登录') {
    throw new BusinessFilter({
      code: BUSINESS_ERROR_CODE.USER_NO_LOGIN,
      message,
    });
  }
}
