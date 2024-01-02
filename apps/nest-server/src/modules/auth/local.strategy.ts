import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/common/providers/businessThrown/business.code.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authSerevice: AuthService,
    private readonly thrownService: BusinessThrownService,
  ) {
    super({ usernameField: 'userName' });
  }

  async validate(userName: string, password: string): Promise<any> {
    console.log('validate==', userName, password);
    const user = await this.authSerevice.validateUser(userName, password);
    if (!user) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_VALID_FAIL);
    }
    return user;
  }
}
