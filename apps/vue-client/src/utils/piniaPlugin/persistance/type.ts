import { IStorage } from '@/utils/storage/storage';
import { Store, StoreState } from 'pinia';
import 'pinia';

export interface PersistOptions {
  storage: IStorage;

  //  哪个变量需要存储
  cacheKey: Partial<Record<keyof StoreState<Store>, boolean>>;
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // 开启持久化的配置
    persist?: PersistOptions;
  }

  export interface PiniaCustomProperties {
    $persist: () => void;
  }
}
