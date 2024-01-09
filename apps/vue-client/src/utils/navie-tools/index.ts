import { createDiscreteApi } from 'naive-ui';
import { setupMessage } from './setupMessage';

//  navie脱离上下文的api
export function setupDiscreteApi() {
  const { message, notification, dialog, loadingBar } = createDiscreteApi([
    'message',
    'dialog',
    'notification',
    'loadingBar',
  ]);

  window.$message = setupMessage(message);
  window.$notification = notification;
  window.$dialog = dialog;
  window.$loadingBar = loadingBar;
}
