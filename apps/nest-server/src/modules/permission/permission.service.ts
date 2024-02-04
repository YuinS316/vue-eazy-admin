import { Inject, Injectable, Logger } from '@nestjs/common';
import { to } from 'await-to-js';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { BusinessThrownService } from '@/common/providers/businessThrown/businessThrown.provider';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private permissionRepo: Repository<Permission>,
    @Inject(BusinessThrownService)
    private thrownService: BusinessThrownService,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const [err, data] = await to(this.permissionRepo.save(createPermissionDto));

    if (err) {
      this.logger.error(err);
    } else {
      this.logger.log(data);
    }

    return !err;
  }

  async getMenuPermission() {
    const [err, data] = await to(
      this.permissionRepo.find({
        where: {
          type: 'menu',
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
