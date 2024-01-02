import { BusinessFilter } from '@/common/exceptions/business/business.filter';
import { Injectable } from '@nestjs/common';
import {
  BUSINESS_ERROR_CODE,
  BUSINESS_ERROR_MESSAGE,
} from '@/common/providers/businessThrown/business.code.enum';

@Injectable()
export class BusinessThrownService {
  constructor() {}

  throwError(code: BUSINESS_ERROR_CODE, message?: string) {
    if (!message) {
      message = BUSINESS_ERROR_MESSAGE[code];
    }

    throw new BusinessFilter({
      code,
      message,
    });
  }

  throwCommon(message: string) {
    this.throwError(BUSINESS_ERROR_CODE.COMMON, message);
  }

  throwNoLogin() {
    this.throwError(BUSINESS_ERROR_CODE.USER_NO_LOGIN);
  }

  throwTokenFail() {
    this.throwError(BUSINESS_ERROR_CODE.USER_EXPIRED);
  }
}
