import { Inject, Injectable, Logger } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { to } from 'await-to-js';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/common/providers/businessThrown/business.code.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject('USER_REPOSITORY')
    private userRepo: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepo: Repository<Role>,
    @Inject('PERMISSION_REPOSITORY')
    private permissionRepo: Repository<Permission>,
    @Inject('PROFILE_REPOSITORY')
    private profileRepo: Repository<Profile>,
    @Inject(BusinessThrownService)
    private thrownService: BusinessThrownService,
  ) {}

  async createUser(user: CreateUserDto) {
    const isExsistUser = await this.findUserByName(user.userName);

    //  先校验是否存在用户
    if (isExsistUser) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_EXSIST);
      return;
    }

    const newUser = this.userRepo.create(user);
    if (!newUser.profile) {
      newUser.profile = this.profileRepo.create();
    }
    newUser.password = hashSync(user.password);

    const [err, res] = await to(this.userRepo.save(newUser));

    if (err) {
      this.logger.error(err);
    } else {
      this.logger.log(res);
    }

    return !err;
  }

  async findUserByName(userName: string) {
    return this.userRepo.findOne({
      where: { userName },
      select: ['id', 'userName', 'password'],
      relations: {
        profile: true,
        roles: true,
      },
    });
  }
}
