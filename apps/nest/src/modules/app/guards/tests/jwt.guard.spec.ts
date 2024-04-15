import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { testImportModules } from '@test/helper';
import { JwtAuthGuard } from '../jwt.guard';
import { AuthService } from '@/modules/auth/auth.service';
import {
  BUSINESS_ERROR_CODE,
  BUSINESS_ERROR_MESSAGE,
} from '@/constants/errCode.enum';
import { UserService } from '@/modules/user/user.service';
import { createPayload } from '@test/fixture/user';

async function setupTesting() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: testImportModules,
    providers: [JwtAuthGuard, AuthService, UserService],
  }).compile();

  return {
    authService: moduleRef.get<AuthService>(AuthService),
    jwtGuard: moduleRef.get<JwtAuthGuard>(JwtAuthGuard),
  };
}

function mockReqContext(token: string) {
  const mockRequest = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const mockContext: ExecutionContext = createMock<ExecutionContext>({
    switchToHttp: () => ({
      getRequest: () => mockRequest,
    }),
  });

  return { context: mockContext, request: mockRequest };
}

describe('JwtGuard', () => {
  let jwtGuard: JwtAuthGuard;

  let authService: AuthService;

  beforeAll(async () => {
    const testing = await setupTesting();
    authService = testing.authService;
    jwtGuard = testing.jwtGuard;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should get token when header contain authorization', function () {
    const token = 'test123';
    const { request } = mockReqContext(token);
    expect(jwtGuard.extractTokenFromHeader(request as any)).toBe(token);
  });

  it('should throw error when header do not contain authorization', function () {
    const { context } = mockReqContext('');
    expect(jwtGuard.canActivate(context)).rejects.toThrow(
      BUSINESS_ERROR_MESSAGE[BUSINESS_ERROR_CODE.USER_NO_LOGIN],
    );
  });

  it('should throw error when token is invalid', function () {
    const { context } = mockReqContext('test');
    expect(jwtGuard.canActivate(context)).rejects.toThrow(
      BUSINESS_ERROR_MESSAGE[BUSINESS_ERROR_CODE.TOKEN_INVALID],
    );
  });

  it('should throw error when token in jwt is expired', async function () {
    const now = new Date().getTime();
    const payload = createPayload();
    const token = authService.signJWT(payload);

    //  7天后jwt过期
    const expirationTime = 7 * 24 * 60 * 60 * 1000 + 1;
    jest.setSystemTime(now + expirationTime);

    const { context } = mockReqContext(token);
    expect(jwtGuard.canActivate(context)).rejects.toThrow(
      BUSINESS_ERROR_MESSAGE[BUSINESS_ERROR_CODE.TOKEN_EXPIRED],
    );
  });

  it('should throw error when token in redis is expired', async function () {
    const payload = createPayload();
    const token = authService.signJWT(payload);

    await authService.saveTokenToRedis(token, payload, 0);

    const { context } = mockReqContext(token);
    expect(jwtGuard.canActivate(context)).rejects.toThrow(
      BUSINESS_ERROR_MESSAGE[BUSINESS_ERROR_CODE.USER_EXPIRED],
    );
  });

  it('should return true when token is valid and is not expired', async function () {
    const payload = createPayload();
    const token = authService.signJWT(payload);

    await authService.saveTokenToRedis(token, payload);

    const { context } = mockReqContext(token);
    expect(jwtGuard.canActivate(context)).resolves.toBe(true);
  });
});
