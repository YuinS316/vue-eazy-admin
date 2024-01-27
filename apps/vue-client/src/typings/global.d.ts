import type {
  // MessageProviderInst,
  NotificationProviderInst,
  DialogProviderInst,
  LoadingBarApi,
} from 'naive-ui';
import { IMessage } from '@/utils/navie-tools/setupMessage';

import 'vue-router';

export {};

declare global {
  interface Window {
    $message: IMessage;
    $notification: NotificationProviderInst;
    $dialog: DialogProviderInst;
    $loadingBar: LoadingBarApi;
  }

  type Nullable<T> = T | null;
}

declare module 'vue-router' {
  //  自定义meta字段
  interface RouteMeta {
    //  使用的布局，没有的话就默认使用app store中的默认布局
    layout?: string;
    icon?: string;
    title?: string;
    keepAlive?: boolean;
  }
}
