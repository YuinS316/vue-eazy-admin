import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,

    @Inject('REDIS')
    private redisClient: Redis,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const res = await this.userRepository.save(createUserDto);
    console.log('res save==', res);
    return res;
  }

  async findAll() {
    console.log('findAll====');
    this.logger.log({ func: 'findAll' });
    // return `This action returns all users`;
    return await this.redisClient.hget('db0', 'test_id');
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
