import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/common/providers/businessThrown/business.code.enum';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepo: Repository<Role>,
    @Inject('PERMISSION_REPOSITORY')
    private permissionRepo: Repository<Permission>,
    @Inject(BusinessThrownService)
    private thrownService: BusinessThrownService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existRole = await this.roleRepo.findOne({
      where: [{ name: createRoleDto.name }, { code: createRoleDto.code }],
    });

    //  角色已存在
    if (existRole) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.ROLE_EXSIST);
      return;
    }

    const role = this.roleRepo.create(createRoleDto);
    role.permissions = await this.permissionRepo.find({
      where: { id: In(createRoleDto.permissionIdList) },
    });

    return this.roleRepo.save(role);
  }

  async getRoleByCode(code: string) {
    const res = await this.roleRepo.findOne({
      where: { code },
      relations: ['permissions'],
    });

    if (res) {
      res.permissions = res.permissions.filter((item) => item.type === 'menu');
      return res;
    } else {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXSIST);
    }
  }
}
