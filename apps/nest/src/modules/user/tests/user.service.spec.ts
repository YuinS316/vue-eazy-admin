import { Test } from '@nestjs/testing';
import { cleanDB, endDB, startDB, testImportModules } from '@test/helper';
import { UserService } from '@/modules/user/user.service';
import { DBType, DB } from '@/modules/global/providers/mysql.provider';
import { createUser } from '@test/fixture/user';

async function setupTesting() {
  const moduleRef = await Test.createTestingModule({
    imports: testImportModules,
    providers: [UserService],
  }).compile();

  return {
    db: moduleRef.get<DBType>(DB),
    userService: moduleRef.get<UserService>(UserService),
  };
}

const user = createUser();

describe('user service', () => {
  let db: DBType;
  let userService: UserService;

  beforeAll(async () => {
    const testing = await setupTesting();
    db = testing.db;
    userService = testing.userService;
  });

  beforeEach(async () => {
    await startDB(db);
  });

  afterAll(async () => {
    await cleanDB(db);
    await endDB(db);
  });

  it('should create user success', async function () {
    const res = await userService.createUser(user);

    expect(res?.userName).toBe(user.userName);
  });

  it('should throw error when user is created', function () {
    expect(userService.createUser(user)).rejects.toThrow();
  });

  it('should find user by userName', async function () {
    const res = await userService.findUserByName(user.userName);

    expect(res).toEqual(expect.objectContaining({ userName: user.userName }));
  });
});
