import { Test } from '@nestjs/testing';
import { cleanDB, endDB, startDB, testImportModules } from '@test/helper';
import { UserService } from '@/modules/user/user.service';
import { DBType, DB } from '@/modules/global/providers/mysql.provider';
import { createUser, createPayload, createToken } from '@test/fixture/user';
import { AuthService } from '@/modules/auth/auth.service';
import { omit } from 'radash';

async function setupTesting() {
  const moduleRef = await Test.createTestingModule({
    imports: testImportModules,
    providers: [UserService, AuthService],
  }).compile();

  return {
    db: moduleRef.get<DBType>(DB),
    userService: moduleRef.get<UserService>(UserService),
    authService: moduleRef.get<AuthService>(AuthService),
  };
}

const user = createUser();
const payload = createPayload();
const token = createToken();

describe('auth service', () => {
  let db: DBType;
  let userService: UserService;
  let authService: AuthService;

  beforeAll(async () => {
    const testing = await setupTesting();
    db = testing.db;
    userService = testing.userService;
    authService = testing.authService;
  });

  beforeEach(async () => {
    await startDB(db);
  });

  afterAll(async () => {
    await cleanDB(db);
    await endDB(db);
  });

  it('should validateUser return null when user is not exist', function () {
    // const res = await userService.createUser(user);

    expect(authService.validateUser('', '')).resolves.toBe(null);
  });

  it('should validateUser return user without password when user is exist', async function () {
    const res = await userService.createUser(user);

    expect(
      await authService.validateUser(user.userName, user.password),
    ).toEqual(omit(res, ['password']));
  });

  it('should set token into redis', async function () {
    await authService.resetTokenInRedis();

    await authService.saveTokenToRedis(token, payload);

    expect(await authService.queryRedisByPayload(payload)).toBe(token);
  });
});
