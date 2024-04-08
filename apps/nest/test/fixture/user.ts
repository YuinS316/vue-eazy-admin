import { JWTPayload } from '@typings/index';

export const createUser = () => {
  return {
    userName: 'test12345',
    password: '123456',
  };
};

export const createPayload = (): JWTPayload => {
  return {
    id: 0,
    userName: 'testUser',
  };
};

export const createToken = () => 'test123';
