import type {
  MessageProviderInst,
  NotificationProviderInst,
  DialogProviderInst,
  LoadingBarApi,
} from 'naive-ui';

export {};

declare global {
  interface Window {
    $message: MessageProviderInst;
    $notification: NotificationProviderInst;
    $dialog: DialogProviderInst;
    $loadingBar: LoadingBarApi;
  }
}
