import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/common/providers/businessThrown/business.code.enum';
import {
  AddPermissionToMultipleRolesDto,
  AddRoleToUsersDto,
  AllocPermissionsToRoleDto,
  AllocRolesToUserDto,
} from '@/modules/role/dto/alloc-user-role.dto';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepo: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepo: Repository<Role>,
    @Inject('PERMISSION_REPOSITORY')
    private permissionRepo: Repository<Permission>,
    @Inject(BusinessThrownService)
    private thrownService: BusinessThrownService,
  ) {}

  /**
   * 创建角色
   * @param createRoleDto
   */
  async create(createRoleDto: CreateRoleDto) {
    const existRole = await this.roleRepo.findOne({
      where: [{ name: createRoleDto.name }, { code: createRoleDto.code }],
    });

    //  角色已存在
    if (existRole) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.ROLE_EXIST);
      return;
    }

    const role = this.roleRepo.create(createRoleDto);
    role.permissions = await this.permissionRepo.find({
      where: { id: In(createRoleDto.permissionIdList) },
    });

    return this.roleRepo.save(role);
  }

  /**
   * 通过code查找角色
   * @param roleCode
   */
  async getRoleByCode(roleCode: string) {
    const res = await this.roleRepo.findOne({
      where: { code: roleCode },
      relations: ['permissions'],
    });

    if (res) {
      res.permissions = res.permissions.filter((item) => item.type === 'menu');
      return res;
    } else {
      return null;
    }
  }

  /**
   * 给同个用户分配多个角色
   * @param dto
   */
  async allocRolesToUser(dto: AllocRolesToUserDto) {
    const roleList = await this.roleRepo.find({
      where: {
        code: In(dto.roleCodeList),
      },
    });

    //  先查询分配的角色是否存在
    if (dto.roleCodeList.length !== roleList.length) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
      return;
    }

    const user = await this.userRepo.findOne({
      where: {
        userName: dto.userName,
      },
    });

    if (!user) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_NOT_EXIST);
      return;
    }

    user.roles = roleList;
    return await this.userRepo.save(user);
  }

  /**
   * 给多个用户添加单个角色
   * @param dto
   */
  async addRoleToMultipleUsers(dto: AddRoleToUsersDto) {
    const role = await this.roleRepo.findOne({
      where: {
        code: dto.roleCode,
      },
      relations: {
        users: true,
      },
    });

    //  角色不存在
    if (!role) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
      return;
    }

    const userList = await this.userRepo.find({
      where: {
        userName: In(dto.userNameList),
      },
    });

    //  角色不存在
    if (userList.length !== dto.userNameList.length) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.USER_NOT_EXIST);
      return;
    }

    const newUserList: User[] = [];
    [...role.users, ...userList].forEach((item) => {
      const isExist = newUserList.find((innerItem) => innerItem.id === item.id);
      if (!isExist) {
        newUserList.push(item);
      }
    });

    role.users = newUserList;
    return await this.roleRepo.save(role);
  }

  /**
   * 给同个角色分配多个权限
   * @param dto
   */
  async allocPermissionsToRole(dto: AllocPermissionsToRoleDto) {
    const permissionList = await this.permissionRepo.find({
      where: {
        code: In(dto.permissionCodeList),
      },
    });

    if (permissionList.length !== dto.permissionCodeList.length) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.PERMISSION_NOT_EXIST);
      return;
    }

    const role = await this.roleRepo.findOne({
      where: {
        code: dto.roleCode,
      },
    });

    if (!role) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
      return;
    }

    role.permissions = permissionList;
    const res = await this.roleRepo.save(role);

    return res;
  }

  /**
   * 给多个角色添加单个权限
   * @param dto
   */
  async addPermissionToMultipleRoles(dto: AddPermissionToMultipleRolesDto) {
    const roleList = await this.roleRepo.find({
      where: {
        code: In(dto.roleCodeList),
      },
    });

    if (roleList.length !== dto.roleCodeList.length) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
      return;
    }

    const permission = await this.permissionRepo.findOne({
      where: {
        code: dto.permissionCode,
      },
      relations: {
        roles: true,
      },
    });

    if (!permission) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.PERMISSION_NOT_EXIST);
      return;
    }

    const newRoles: Role[] = [];
    [...permission.roles, ...roleList].forEach((role) => {
      const isExist = newRoles.find((item) => item.code === role.code);
      if (!isExist) {
        newRoles.push(role);
      }
    });

    permission.roles = newRoles;

    const res = await this.permissionRepo.save(permission);

    return res;
  }
}
