import { Inject, Injectable, Logger } from '@nestjs/common';
import { to } from 'await-to-js';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Like, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';
import { BUSINESS_ERROR_CODE } from '@/common/providers/businessThrown/business.code.enum';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private permissionRepo: Repository<Permission>,
    @Inject(BusinessThrownService)
    private thrownService: BusinessThrownService,
  ) {}

  async create(dto: CreatePermissionDto) {
    const exsistPermission = await this.permissionRepo.findOne({
      where: [
        { code: dto.code, type: dto.type },
        { name: dto.name, type: dto.type },
      ],
    });

    if (exsistPermission) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.PERMISSION_EXIST);
      return;
    }

    const [err, data] = await to(this.permissionRepo.save(dto));

    if (err) {
      this.logger.error(err);
    } else {
      this.logger.log(data);
    }

    return !err;
  }

  async delete(id: number) {
    const permission = await this.permissionRepo.findOne({
      where: {
        id,
      },
    });

    if (permission) {
      await this.permissionRepo.remove(permission);
      return true;
    }

    return false;
  }

  async getMenuPermission(name: string) {
    const [err, data] = await to(
      this.permissionRepo.find({
        where: {
          type: 'menu',
          name: name ? Like(`%${name}%`) : undefined,
        },
        order: {
          order: 'ASC',
        },
      }),
    );

    if (err) {
      this.logger.error(err);
      return [];
    }

    this.logger.log(data);

    return data;
  }
}
