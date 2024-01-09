import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setupDiscreteApi } from '..';

describe('Setup Message', () => {
  const TestDemo = defineComponent({
    setup() {
      setupDiscreteApi();
    },
    render() {
      return h('div', {}, '');
    },
  });

  let wrapper: VueWrapper;

  //  从navie源码里面翻出来的类名
  const getClsByType = (type: string) => `.n-message--${type}-type`;

  beforeEach(() => {
    vi.useFakeTimers();
    wrapper = mount(TestDemo);
  });

  afterEach(() => {
    vi.useRealTimers();
    wrapper?.unmount();
    window.$message.destroyAll();
  });

  describe('test type', () => {
    it.each([
      { type: 'info', content: 'test info' },
      { type: 'success', content: 'test success' },
      { type: 'warning', content: 'test warning' },
      { type: 'error', content: 'test error' },
      { type: 'loading', content: 'test loading' },
    ])('test type $type -> expected $content', async ({ type, content }) => {
      window.$message[type as 'info'](content);
      await nextTick();
      const cls = getClsByType(type);
      expect(document.querySelectorAll(cls).length).toBe(1);
      expect(document.querySelectorAll(cls)[0].textContent).toBe(content);
    });
  });

  it('should can change type and content with specified key', async () => {
    window.$message.info('test info', { key: 't' });
    await nextTick();

    const content = 'test success';
    window.$message.success(content, { key: 't' });
    await nextTick();

    const infoCls = getClsByType('info');
    const sucCls = getClsByType('success');
    expect(document.querySelectorAll(infoCls).length).toBe(0);
    expect(document.querySelectorAll(sucCls).length).toBe(1);
    expect(document.querySelectorAll(sucCls)[0].textContent).toBe(content);
  });

  it('should destroyed after duration with specified key', async () => {
    //  因为传入key之后是手动管理的清除，所以有必要验证
    const { messageMap, timerMap } = window.$message.inspect();
    expect(messageMap.size).toBe(0);

    const key = 'd';
    window.$message.info('qwer', { key, duration: 100 });
    await nextTick();

    //  还没有到duration时，应该存在
    await vi.advanceTimersByTimeAsync(50);
    let msgInst = messageMap.get(key)!;
    expect(msgInst).not.toBeUndefined();
    expect(timerMap.has(msgInst!)).toBe(true);

    //  过了duration，应该消失
    await vi.advanceTimersByTimeAsync(50);
    msgInst = messageMap.get(key)!;
    expect(msgInst).toBeUndefined();
    expect(timerMap.has(msgInst)).toBe(false);
    const cls = getClsByType('info');
    expect(document.querySelectorAll(cls).length).toBe(0);
  });

  //  vtu有点坑爹，onAfterLeave 是在 <transition> 触发的，但是vtu不触发
  it.skip('should  onAfterLeave be trigger', async () => {
    wrapper.unmount();
    wrapper = mount(TestDemo);

    const key = 'o';
    const cb = vi.fn(() => {});
    window.$message.info('', {
      key,
      duration: 100,
      closable: true,
      onAfterLeave: cb,
    });

    await nextTick();

    await vi.advanceTimersToNextTimerAsync();
    await nextTick();

    // expect(cb).toHaveBeenCalled();
  });
});
