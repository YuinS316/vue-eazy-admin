import { Inject, Injectable, Logger } from '@nestjs/common';
import { to } from 'await-to-js';
import { DB, DBType } from '@/modules/global/providers/mysql.provider';
import { BusinessThrownService } from '@/modules/global/providers/businessThrown.provider';
import { CreatePermissionDto } from '@/modules/permission/dto/create-permission.dto';
import { BUSINESS_ERROR_CODE } from '@/constants/errCode.enum';
import { Permission } from '@/schema';
import { PermissionType } from '@typings/permission';
import { eq, inArray, sql } from 'drizzle-orm';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(DB) private db: DBType,
    @Inject(BusinessThrownService) private thrown: BusinessThrownService,
    private logger: Logger,
  ) {}

  /**
   * 创建权限
   * @param dto
   */
  async create(dto: CreatePermissionDto) {
    const existPermission = await this.findPermissionByCodeAndType(
      dto.code,
      dto.type,
    );

    if (existPermission) {
      this.thrown.throwError(BUSINESS_ERROR_CODE.PERMISSION_EXIST);
      return;
    }

    const basePermission = Permission.$inferInsert;
    const newPermission = {
      ...basePermission,
      ...dto,
    };

    const [err] = await to(this.db.insert(Permission).values(newPermission));

    if (err) {
      this.logger.error(err);
      throw new Error(err.message);
    }

    return this.findPermissionByCodeAndType(dto.code, dto.type);
  }

  async findPermissionByCodeAndType(code: string, type: PermissionType) {
    return this.db.query.Permission.findFirst({
      where: (permission, { eq, and }) =>
        and(
          eq(permission.code, code),
          eq(permission.type, type),
          eq(permission.enable, true),
        ),
    });
  }

  async findPermissionByIdList(idList: number[]) {
    return this.db.query.Permission.findMany({
      where: (permission, { inArray }) => inArray(permission.id, idList),
    });
  }

  /**
   * 物理删除
   * @param id
   */
  async delete(id: number) {
    this.db.delete(Permission).where(eq(Permission.id, id));
  }

  /**
   * 更新是否可用状态
   * @param idList
   * @param enable
   */
  async updateEnabled(idList: number[], enable: boolean) {
    await this.db
      .update(Permission)
      .set({ enable })
      .where(inArray(Permission.id, idList));

    return this.db.query.Permission.findMany({
      where(permission, { inArray }) {
        return inArray(permission.id, idList);
      },
    });
  }

  /**
   * 如果提供了code或者name，进行模糊查询，不然就是全体查询
   * @param name
   */
  async getMenuPermissionByName(name: string) {
    return this.db.query.Permission.findMany({
      where(permission, { like, and, eq }) {
        const condList = [
          eq(permission.type, 'menu'),
          eq(permission.enable, true),
        ];
        if (name) {
          condList.push(like(permission.name, `%${name}%`));
          condList.push(like(permission.code, `%${name}%`));
        }
        return and(...condList);
      },
    });
  }
}
