import { createDiscreteApi } from 'naive-ui';

//  navie脱离上下文的api
export function setupDiscreteApi() {
  const { message, notification, dialog, loadingBar } = createDiscreteApi([
    'message',
    'dialog',
    'notification',
    'loadingBar',
  ]);

  window.$message = message;
  window.$notification = notification;
  window.$dialog = dialog;
  window.$loadingBar = loadingBar;
}
