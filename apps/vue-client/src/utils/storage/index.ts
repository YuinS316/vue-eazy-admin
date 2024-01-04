import { IStorage, IStorageOptions } from './storage';

//  可能存在共享localStorage之类的场景，需要做区分
const namespace = 'Ez';
//  主要用于区分业务模块，不想区分也没关系
const prefix = 'default';

export const createLocalStorage = (
  options: Omit<IStorageOptions, 'storage'>,
) => {
  return new IStorage({
    storage: localStorage,
    ...options,
  });
};

export const createSessionStorage = (
  options: Omit<IStorageOptions, 'storage'>,
) => {
  return new IStorage({
    storage: sessionStorage,
    ...options,
  });
};

export const storageLocal = createLocalStorage({ namespace, prefix });
export const storageSession = createSessionStorage({ namespace, prefix });
