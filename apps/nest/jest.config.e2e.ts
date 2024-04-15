import baseConfig from './jest.config';
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  ...baseConfig,
  testRegex: '.*\\.e2e-spec\\.ts$',
};

export default config;
