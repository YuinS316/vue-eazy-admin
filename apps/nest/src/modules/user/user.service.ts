import { Inject, Injectable, Logger } from '@nestjs/common';
import { to } from 'await-to-js';
import { hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { DB, DBType } from '@/modules/global/providers/mysql.provider';
import { User, UserSchema } from '@/schema';
import { BusinessThrownService } from '@/modules/global/providers/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/constants/errCode.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(DB) private db: DBType,
    @Inject(BusinessThrownService) private thrown: BusinessThrownService,
    private logger: Logger,
  ) {}

  /**
   * 创建用户
   * @param user
   */
  async createUser(user: CreateUserDto): Promise<UserSchema> {
    const existUser = await this.findUserByName(user.userName);

    if (existUser) {
      this.logger.error(`用户已创建 ==> ${JSON.stringify(existUser)}`);
      this.thrown.throwError(BUSINESS_ERROR_CODE.USER_EXIST);
      return null;
    }

    const baseUser = User.$inferInsert;

    const newUser = {
      ...baseUser,
      ...user,
      password: hashSync(user.password),
      createdBy: 'system',
      updatedBy: 'system',
    };

    //  drizzle的mysql暂不支持返回新插入的记录
    const [err] = await to(this.db.insert(User).values(newUser));
    if (!err) {
      return this.findUserByName(user.userName) as any;
    } else {
      this.logger.error(err);
      return null;
    }
  }

  /**
   * 通过用户名查找用户
   * @param userName 用户名
   * @param showPassword 是否展示密码
   */
  async findUserByName(
    userName: string,
    showPassword = false,
  ): Promise<UserSchema> {
    return this.db.query.User.findFirst({
      where: (user, { eq }) => eq(user.userName, userName),
      ...(showPassword
        ? {}
        : {
            columns: {
              password: showPassword,
            },
          }),
    }) as any;
  }
}
