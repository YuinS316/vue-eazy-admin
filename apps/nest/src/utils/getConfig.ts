import { parse } from 'yaml';
import { join } from 'path';
import * as fs from 'fs';

// 获取项目运行环境
export const getEnv = () => {
  return process.env.NODE_ENV;
};

// 读取项目配置
export const getConfig = (key?: string, env?) => {
  const environment = env || getEnv() || 'dev';
  const yamlPath = join(process.cwd(), `./.config/.${environment}.yaml`);
  const file = fs.readFileSync(yamlPath, 'utf8');
  const config = parse(file);

  if (key) {
    return config[key];
  }

  return config;
};
