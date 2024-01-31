import { DialogOptions, DialogProviderInst, DialogReactive } from 'naive-ui';

export type SetupDialog = (dialog: DialogProviderInst) => IDialog;

export type IDialog = (options: DialogOptions) => DialogReactive;

//  不喜欢回调的方式，封装成Promise
export const setupDialog: SetupDialog = (dialog) => {
  return function (options) {
    return dialog.create({
      type: 'warning',
      positiveText: '确定',
      negativeText: '取消',
      ...options,
    });
  };
};
