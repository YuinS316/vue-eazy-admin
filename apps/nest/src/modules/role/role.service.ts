import { Inject, Injectable, Logger } from '@nestjs/common';
import { DB, DBType } from '@/modules/global/providers/mysql.provider';
import { BusinessThrownService } from '@/modules/global/providers/businessThrown.provider';
import { CreateRoleDto } from '@/modules/role/dto/create-role.dto';
import { BUSINESS_ERROR_CODE } from '@/constants/errCode.enum';
import {
  PermissionSchema,
  Role,
  RolePermission,
  RoleSchema,
  UserRole,
} from '@/schema';
import { omit } from 'radash';
import { PermissionService } from '@/modules/permission/permission.service';
import { to } from 'await-to-js';
import {
  AddPermissionToMultipleRolesDto,
  AddRoleToUsersDto,
  AllocPermissionsToRoleDto,
  AllocRolesToUserDto,
} from '@/modules/role/dto/alloc-role.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class RoleService {
  constructor(
    @Inject(DB) private db: DBType,
    @Inject(BusinessThrownService) private thrown: BusinessThrownService,
    @Inject(PermissionService) private permissionService: PermissionService,
    private logger: Logger,
  ) {}

  /**
   * 分配多个角色给单个用户
   * @param dto
   * @param operator 操作人
   */
  async allocRolesToUser(dto: AllocRolesToUserDto, operator: string) {
    const existUser = await this.db.query.User.findFirst({
      where(schema, { eq }) {
        return eq(schema.userName, dto.userName);
      },
    });

    if (!existUser) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.USER_NOT_EXIST);
      return;
    }

    let roleList: RoleSchema[] = [];

    //  fix: inArray遇到空数组会报错
    if (dto.roleCodeList.length > 0) {
      roleList = await this.db.query.Role.findMany({
        where(schema, { inArray }) {
          return inArray(schema.code, dto.roleCodeList);
        },
      });
    }

    if (roleList.length !== dto.roleCodeList.length) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
      return;
    }

    const roleIdList = roleList.map((role) => role.id);

    //  重新分配绑定关系
    await this.reAllocUserRolesBindings(existUser.id, roleIdList, operator);

    //  返回用户新的角色列表
    return this.findRolesByUserId(existUser.id);
  }

  /**
   * 查找用户对应的角色
   * @param userId
   */
  async findRolesByUserId(userId: number) {
    return this.db.query.UserRole.findMany({
      where(userRole, { eq }) {
        return eq(userRole.userId, userId);
      },
    });
  }

  /**
   * 添加单个角色给多个用户
   * @param dto
   * @param operator
   */
  async addRoleToMultipleUsers(dto: AddRoleToUsersDto, operator: string) {
    const existRole = await this.db.query.Role.findFirst({
      where(schema, { eq }) {
        return eq(schema.code, dto.roleCode);
      },
    });

    if (!existRole) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
      return;
    }

    const userList = await this.db.query.User.findMany({
      where(schema, { inArray }) {
        return inArray(schema.userName, dto.userNameList);
      },
    });

    if (userList.length !== dto.userNameList.length) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.USER_NOT_EXIST);
      return;
    }

    const userIdList = userList.map((user) => user.id);

    //  添加绑定关系
    await this.addUserRoleBinding(existRole.id, userIdList, operator);

    return this.findUsersByRoleId(existRole.id);
  }

  /**
   * 查找拥有角色的用户
   * @param roleId
   */
  async findUsersByRoleId(roleId: number) {
    return this.db.query.UserRole.findMany({
      where(schema, { eq }) {
        return eq(schema.roleId, roleId);
      },
    });
  }

  /**
   * 分配权限给角色
   * @param dto
   * @param operator
   */
  async allocPermissionsToRole(
    dto: AllocPermissionsToRoleDto,
    operator: string,
  ) {
    const existRole = await this.db.query.Role.findFirst({
      where(schema, { eq }) {
        return eq(schema.code, dto.roleCode);
      },
    });

    if (!existRole) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
      return;
    }

    let permissionList: PermissionSchema[] = [];

    if (dto.permissionCodeList.length > 0) {
      permissionList = await this.db.query.Permission.findMany({
        where(schema, { inArray }) {
          return inArray(schema.code, dto.permissionCodeList);
        },
      });
    }

    if (permissionList.length !== dto.permissionCodeList.length) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.PERMISSION_NOT_EXIST);
      return;
    }

    const permissionIdList = permissionList.map((item) => item.id);

    await this.reAllocRolePermissionsBindings(
      existRole.id,
      permissionIdList,
      operator,
    );

    return this.findPermissionsByRoleId(existRole.id);
  }

  async findPermissionsByRoleId(roleId: number) {
    return this.db.query.RolePermission.findMany({
      where(schema, { eq }) {
        return eq(schema.roleId, roleId);
      },
    });
  }

  /**
   * 给多个角色添加权限
   * @param dto
   * @param operator
   */
  async addPermissionToMultipleRoles(
    dto: AddPermissionToMultipleRolesDto,
    operator: string,
  ) {
    const existPermission = await this.db.query.Permission.findFirst({
      where(schema, { eq }) {
        return eq(schema.code, dto.permissionCode);
      },
    });

    if (!existPermission) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.PERMISSION_NOT_EXIST);
      return;
    }

    let roleList: RoleSchema[] = [];

    if (dto.roleCodeList.length > 0) {
      roleList = await this.db.query.Role.findMany({
        where(schema, { inArray }) {
          return inArray(schema.code, dto.roleCodeList);
        },
      });
    }

    if (roleList.length !== dto.roleCodeList.length) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
      return;
    }

    const roleIdList = roleList.map((item) => item.id);

    await this.addRolePermissionBinding(
      existPermission.id,
      roleIdList,
      operator,
    );

    return this.findRolesByPermissionId(existPermission.id);
  }

  async findRolesByPermissionId(permissionId: number) {
    return this.db.query.RolePermission.findMany({
      where(schema, { eq }) {
        return eq(schema.permissionId, permissionId);
      },
    });
  }

  /**
   * 通过角色查询菜单
   * @param roleCode
   */
  async findPermissionsByRoleCode(roleCode: string) {
    const role = await this.db.query.Role.findFirst({
      where(role, { eq }) {
        return eq(role.code, roleCode);
      },
    });

    if (role) {
      const rolePermissionList = await this.db.query.RolePermission.findMany({
        where(rolePermission, { eq }) {
          return eq(rolePermission.roleId, role.id);
        },
      });

      //  fix: 如果permissions为空，inArray会报错
      if (!rolePermissionList.length) {
        return {
          ...role,
          permissions: [],
        };
      }

      const permissionIdList = rolePermissionList.map(
        (item) => item.permissionId,
      );

      const permissions = await this.db.query.Permission.findMany({
        where(permission, { inArray }) {
          return inArray(permission.id, permissionIdList);
        },
      });

      return {
        ...role,
        permissions,
      };
    } else {
      return null;
    }
  }

  /**
   * 初始化角色
   * @param dto
   */
  async create(dto: CreateRoleDto) {
    const existRole = await this.findRoleByCode(dto.code);

    if (existRole) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.ROLE_EXIST);
      return;
    }

    //  检测permissionId是否存在
    const permissionList = await this.permissionService.findPermissionByIdList(
      dto.permissionIdList,
    );

    if (permissionList.length !== dto.permissionIdList.length) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.PERMISSION_NOT_EXIST);
      return;
    }

    //  校验完成后开启事务
    const [err] = await to(
      this.db.transaction(async (tx) => {
        await this.createRole.apply({ db: tx }, [
          omit(dto, ['permissionIdList']),
          false,
        ]);

        const insertRole = await this.findRoleByCode(dto.code);

        //  角色 - 权限关联安表添加记录
        await this.reAllocRolePermissionsBindings.apply({ db: tx }, [
          insertRole.id,
          dto.permissionIdList,
          dto.createdBy,
        ]);
      }),
    );

    if (err) {
      this.logger.error('创建角色失败 ===> 详情:', err.message);
      return false;
    }

    return true;
  }

  async createRole(
    role: Partial<RoleSchema>,
    returnRecord = true,
  ): Promise<RoleSchema> {
    const baseRole = Role.$inferInsert;

    const newRole = {
      ...baseRole,
      ...role,
    };

    await this.db.insert(Role).values(newRole);

    if (returnRecord) {
      return this.findRoleByCode(role.code);
    }

    return null;
  }

  async findRoleByCode(code: string) {
    return this.db.query.Role.findFirst({
      where(role, { eq }) {
        return eq(role.code, code);
      },
    });
  }

  /**
   * 添加用户 - 角色绑定关系
   * @param roleId
   * @param userIdList
   * @param userName 操作人
   */
  async addUserRoleBinding(
    roleId: number,
    userIdList: number[],
    userName: string,
  ) {
    //  找到那些已经有该角色的用户
    const hasRoleUserList = await this.db.query.UserRole.findMany({
      where(schema, { eq, and, inArray }) {
        return and(
          eq(schema.roleId, roleId),
          inArray(schema.userId, userIdList),
        );
      },
    });

    const hasRoleUserIdList = hasRoleUserList.map((item) => item.userId);

    //  过滤掉这些已经有了该角色的用户
    const shouldAddRoleUserIdList = userIdList.filter((userId) => {
      if (hasRoleUserIdList.includes(userId)) {
        return false;
      }

      return true;
    });

    if (!shouldAddRoleUserIdList.length) {
      return;
    }

    //  添加绑定关系
    await this.db.transaction(async (tx) => {
      const insertData = shouldAddRoleUserIdList.map((userId) => {
        const baseData = UserRole.$inferInsert;
        return {
          ...baseData,
          userId,
          roleId: roleId,
          createdBy: userName,
          updatedBy: userName,
        };
      });
      await tx.insert(UserRole).values(insertData);
    });
  }

  /**
   * 添加角色 - 权限绑定关系
   * @param permissionId
   * @param roleIdList
   * @param userName 操作人
   */
  async addRolePermissionBinding(
    permissionId: number,
    roleIdList: number[],
    userName: string,
  ) {
    //  找到那些已经有该权限的角色
    const hasPermissionRoleList = await this.db.query.RolePermission.findMany({
      where(schema, { eq, and, inArray }) {
        return and(
          eq(schema.permissionId, permissionId),
          inArray(schema.roleId, roleIdList),
        );
      },
    });

    const hasPermissionRoleIdList = hasPermissionRoleList.map(
      (item) => item.roleId,
    );

    //  过滤掉这些已经有了该权限的角色
    const shouldAddPermissionRoleIdList = roleIdList.filter((roleId) => {
      if (hasPermissionRoleIdList.includes(roleId)) {
        return false;
      }

      return true;
    });

    if (!shouldAddPermissionRoleIdList.length) {
      return;
    }

    //  添加绑定关系
    await this.db.transaction(async (tx) => {
      const insertData = shouldAddPermissionRoleIdList.map((roleId) => {
        const baseData = RolePermission.$inferInsert;
        return {
          ...baseData,
          permissionId,
          roleId,
          createdBy: userName,
          updatedBy: userName,
        };
      });
      await tx.insert(RolePermission).values(insertData);
    });
  }

  /**
   * 重新分配用户 - 角色绑定关系
   * @param userId
   * @param roleIdList 新的角色id列表
   * @param userName 操作人
   */
  async reAllocUserRolesBindings(
    userId: number,
    roleIdList: number[],
    userName: string,
  ) {
    await this.db.transaction(async (tx) => {
      //  先删除原有的绑定关系
      await tx.delete(UserRole).where(eq(UserRole.userId, userId));

      //  表示要删除用户的所有角色
      if (!roleIdList.length) {
        return;
      }

      //  重新创建新的绑定关系
      const insertData = roleIdList.map((roleId) => {
        const baseData = UserRole.$inferInsert;
        return {
          ...baseData,
          userId,
          roleId,
          createdBy: userName,
          updatedBy: userName,
        };
      });

      await tx.insert(UserRole).values(insertData);
    });
  }

  /**
   * 重新分配角色 - 权限绑定关系
   * @param roleId
   * @param permissionIdList
   * @param userName
   */
  async reAllocRolePermissionsBindings(
    roleId: number,
    permissionIdList: number[],
    userName: string,
  ) {
    await this.db.transaction(async (tx) => {
      //  先删除原有的绑定关系
      await tx.delete(RolePermission).where(eq(RolePermission.roleId, roleId));

      //  表示要清空它的所有权限
      if (!permissionIdList.length) {
        return;
      }

      //  重新创建新的绑定关系
      const insertData = permissionIdList.map((permissionId) => {
        const baseData = RolePermission.$inferInsert;
        return {
          ...baseData,
          roleId,
          permissionId,
          createdBy: userName,
          updatedBy: userName,
        };
      });

      await tx.insert(RolePermission).values(insertData);
    });
  }
}
