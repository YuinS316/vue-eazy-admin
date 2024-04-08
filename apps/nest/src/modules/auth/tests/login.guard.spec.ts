import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { testImportModules } from '@test/helper';
import { LoginGuard } from '../login.guard';
import { createUser } from '@test/fixture/user';
import { AuthService } from '@/modules/auth/auth.service';

const mockAuthService = {
  validateUser: jest.fn().mockReturnValue(null),
  buildReqUser: jest.fn().mockReturnValue({}),
};

const user = createUser();

async function setupTesting() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [...testImportModules],
    providers: [
      LoginGuard,
      { provide: AuthService, useValue: mockAuthService },
    ],
  }).compile();

  return {
    authService: moduleRef.get<AuthService>(AuthService),
    loginGuard: moduleRef.get<LoginGuard>(LoginGuard),
  };
}

function mockReqBody(body: Record<string, any>) {
  const mockRequest = {
    headers: {
      authorization: 'invalid_token',
    },
    body,
    user: null,
  };

  // 创建一个模拟的 ExecutionContext 对象
  const mockContext: ExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => mockRequest,
    }),
  } as ExecutionContext;

  return { context: mockContext };
}

describe('LoginGuard', () => {
  let loginGuard: LoginGuard;
  let authService: AuthService;

  beforeAll(async () => {
    const testing = await setupTesting();
    authService = testing.authService;
    loginGuard = testing.loginGuard;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw exception when user is not exist', function () {
    const { context } = mockReqBody(user);
    expect(loginGuard.canActivate(context)).rejects.toThrow();
  });

  it('should return true when password is match', function () {
    const mockPayload = {
      id: -1,
      userName: 'test',
    };

    mockAuthService.validateUser.mockReturnValue({});
    mockAuthService.buildReqUser.mockReturnValue(mockPayload);

    const { context } = mockReqBody(user);
    expect(loginGuard.canActivate(context)).resolves.toBeTruthy();
  });
});
