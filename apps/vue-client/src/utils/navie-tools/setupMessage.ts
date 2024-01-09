import type { VNodeChild } from 'vue';
import type {
  MessageProviderInst,
  MessageReactive,
  MessageOptions,
} from 'naive-ui';
import { isArray } from '..';

type IMessageType = 'info' | 'success' | 'warning' | 'error' | 'loading';
type IMessageContentType = string | (() => VNodeChild);
type IMessageOptions = MessageOptions & { key?: string };

export class IMessage {
  static instance: IMessage;

  private readonly messageMap = new Map<string, MessageReactive>();

  //  改成weakmap 可以让 MessageReactive 消失的时候自动gc，省掉手动管理
  private readonly timerMap = new WeakMap<MessageReactive, NodeJS.Timeout>();

  //  关闭弹窗的回调，因为创建 MessageReactive 后，navie没有提供对应的api修改回调事件，所以要自己管理
  private readonly leaveCbMap = new WeakMap<MessageReactive, (() => void)[]>();

  constructor(private NMessage: MessageProviderInst) {
    if (IMessage.instance) {
      return IMessage.instance;
    }
    IMessage.instance = this;
  }

  //  提供给测试文件检测Map是否清空使用的
  inspect() {
    return {
      messageMap: this.messageMap,
      timerMap: this.timerMap,
      leaveCbMap: this.leaveCbMap,
    };
  }

  /**
   * 创建消息，可以复用已有的消息(必须传入key)
   * @param type
   * @param content
   * @param options
   * @returns
   */
  createMessage(
    type: IMessageType,
    content: IMessageContentType | Array<IMessageContentType>,
    options: IMessageOptions = {},
  ) {
    const createNMessage = (msg: IMessageContentType) => {
      this.NMessage[type](msg, options);
    };

    if (isArray(content)) {
      return content.forEach((msg) => createNMessage(msg));
    }

    if (!options.key) {
      return createNMessage(content);
    }

    const { key } = options;

    let currentMessage = this.messageMap.get(key);
    if (currentMessage) {
      currentMessage.type = type;
      currentMessage.content = content;
    } else {
      currentMessage = this.NMessage[type](content, {
        ...options,
        duration: 0,
        onAfterLeave: () => {
          this.messageMap.delete(key);
          const cbs = this.leaveCbMap.get(currentMessage!);
          if (isArray(cbs)) {
            cbs.forEach((cb) => cb());
          }
        },
      });

      this.messageMap.set(key, currentMessage);
    }

    //  处理带有key的消息的过期时间
    this.resolveMessage(key, options.duration);

    //  处理带有key的消息的回调事件
    this.resolveLeaveCallback(key, options);
  }

  /**
   * 管理已有的消息关闭
   * @param key
   * @param duration
   */
  resolveMessage(key: string, duration = 5000) {
    const msgInst = this.messageMap.get(key)!;
    const isExsist = this.timerMap.has(msgInst);
    if (isExsist) {
      clearTimeout(this.timerMap.get(msgInst));
    }
    this.timerMap.set(msgInst, this.destroy(key, duration));
  }

  /**
   * 管理弹窗消失的回调时间
   * @param key
   * @param options
   */
  resolveLeaveCallback(key: string, options: IMessageOptions) {
    if (options.onAfterLeave) {
      const msgInst = this.messageMap.get(key)!;

      const isExsist = this.leaveCbMap.has(msgInst);
      if (!isExsist) {
        this.leaveCbMap.set(msgInst, []);
      }

      const cbs = this.leaveCbMap.get(msgInst)!;

      cbs.push(options.onAfterLeave);
    }
  }

  destroy(key: string, duration = 200) {
    return setTimeout(() => {
      this.messageMap.get(key)?.destroy();
      this.messageMap.delete(key);

      const msgInst = this.messageMap.get(key)!;
      clearTimeout(this.timerMap.get(msgInst));
      this.timerMap.delete(msgInst);
    }, duration);
  }

  destroyAll() {
    this.messageMap.forEach((_, key) => {
      this.destroy(key, 0);
    });
    this.messageMap.clear();
    this.NMessage.destroyAll();
  }

  loading(
    content: IMessageContentType | Array<IMessageContentType>,
    options: IMessageOptions = {},
  ) {
    this.createMessage('loading', content, options);
  }

  success(
    content: IMessageContentType | Array<IMessageContentType>,
    options: IMessageOptions = {},
  ) {
    this.createMessage('success', content, options);
  }

  error(
    content: IMessageContentType | Array<IMessageContentType>,
    options: IMessageOptions = {},
  ) {
    this.createMessage('error', content, options);
  }

  info(
    content: IMessageContentType | Array<IMessageContentType>,
    options: IMessageOptions = {},
  ) {
    this.createMessage('info', content, options);
  }

  warning(
    content: IMessageContentType | Array<IMessageContentType>,
    options: IMessageOptions = {},
  ) {
    this.createMessage('warning', content, options);
  }
}

export function setupMessage(NMessage: MessageProviderInst) {
  return new IMessage(NMessage);
}
