import { IStorage, IStorageOptions } from './storage';

//  可能存在共享localStorage之类的场景，需要做区分
export const namespace = 'Ez';
//  主要用于区分业务模块，不想区分也没关系
export const prefix = 'default';

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

//  默认的storage
export const storageLocal = createLocalStorage({ namespace, prefix });
export const storageSession = createSessionStorage({ namespace, prefix });

//  pinia持久化的storage
//  authStore对应的storage
export const authStorageLocal = createLocalStorage({
  prefix: 'authStore',
  namespace,
});

export const storageLoc = {
  default: storageLocal,
  pinia: {
    auth: authStorageLocal,
  },
};
