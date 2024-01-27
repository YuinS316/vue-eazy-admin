import type { PiniaPluginContext, StateTree, Store } from 'pinia';
import { PersistOptions } from './type';

/**
 * pinia 持久化插件
 * @param ctx
 */
export function PersistancePlugin(ctx: PiniaPluginContext) {
  if (!ctx.options.persist) return;

  const { store, options, pinia } = ctx;

  const persist = options.persist!;

  // HMR handling, ignores stores created as "hot" stores
  if (!(store.$id in pinia.state.value)) {
    // @ts-expect-error `_s is a stripped @internal`
    const original_store = pinia._s.get(store.$id.replace('__hot:', ''));
    if (original_store) Promise.resolve().then(() => original_store.$persist());
    return;
  }

  store.$persist = () => {
    persistState(store.$state, persist);
  };

  //  读取缓存
  loadStorage(store, persist);

  //  订阅变化
  store.$subscribe(
    (_, state) => {
      persistState(state, persist);
    },
    {
      detached: true,
    },
  );
}

//  将storage同步到pinia
function loadStorage(store: Store, persist: PersistOptions) {
  const { storage, cacheKey } = persist;

  for (const key in cacheKey) {
    const cacheValue = storage.getItem(key);
    if (cacheKey) {
      store.$patch({
        [key]: cacheValue,
      });
    }
  }
}

//  将Pinia同步到storage
function persistState(state: StateTree, persist: PersistOptions) {
  const { storage, cacheKey } = persist;

  for (const key in cacheKey) {
    const value = state[key];
    storage.setItem(key, value);
  }
}
