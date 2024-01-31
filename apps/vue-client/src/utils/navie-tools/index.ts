import { createDiscreteApi } from 'naive-ui';
import { setupMessage } from './setupMessage';
import { setupDialog } from './setupDialog';

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
  window.$dialog = setupDialog(dialog);
  window.$loadingBar = loadingBar;
}
