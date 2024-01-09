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

  private messageMap = new Map<string, MessageReactive>();
  private timerMap = new Map<string, NodeJS.Timeout>();

  constructor(private NMessage: MessageProviderInst) {
    if (IMessage.instance) {
      return IMessage.instance;
    }
    IMessage.instance = this;
    // NMessage.create()
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
    const currentMessage = this.messageMap.get(key);
    if (currentMessage) {
      currentMessage.type = type;
      currentMessage.content = content;
    } else {
      this.messageMap.set(
        key,
        this.NMessage[type](content, {
          ...options,
          duration: 0,
          onAfterLeave: () => {
            this.messageMap.delete(key);
            options.onAfterLeave?.();
          },
        }),
      );
    }

    //  自己处理带有key的消息的过期时间
    this.resoveMessage(key, options.duration);
  }

  /**
   * 管理已有的消息关闭
   * @param key
   * @param duration
   */
  resoveMessage(key: string, duration = 5000) {
    const isExsist = this.timerMap.has(key);
    if (isExsist) {
      clearTimeout(this.timerMap.get(key));
    }
    this.timerMap.set(key, this.destroy(key, duration));
  }

  destroy(key: string, duration = 200) {
    return setTimeout(() => {
      this.messageMap.get(key)?.destroy();
      this.messageMap.delete(key);

      clearTimeout(this.timerMap.get(key));
      this.timerMap.delete(key);
    }, duration);
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

  destroyAll() {
    this.messageMap.forEach((_, key) => {
      this.destroy(key, 0);
    });
    this.messageMap.clear();
    this.NMessage.destroyAll();
  }
}

export function setupMessage(NMessage: MessageProviderInst) {
  return new IMessage(NMessage);
}
