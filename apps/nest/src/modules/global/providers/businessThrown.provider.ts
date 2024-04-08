import { Injectable } from '@nestjs/common';
import {
  BUSINESS_ERROR_CODE,
  BUSINESS_ERROR_MESSAGE,
} from '@/constants/errCode.enum';
import { BusinessFilter } from '@/modules/app/exceptions/business.filter';

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
}
