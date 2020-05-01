import { WebStorage } from './WebStorage';
import { MemoryStorage } from './MemoryStorage';
import { IDBStorage } from './IDBStorage';

/**
 * This is a modified version of Vue-LS.
 * See {@link https://github.com/RobinCK/vue-ls}
 */

export const storageResolver = (storage, options) => {
  const defaultStore = new MemoryStorage();
  // If using IndexedDB
  const dbName = options.dbName || options.name;
  const storeName = options.storeName || options.name + '-keyval';

  switch (storage) {
    case 'idb':
      return new IDBStorage(dbName, storeName);
    case 'local':
      return 'localStorage' in window ? window.localStorage : defaultStore;
    case 'session':
      return 'sessionStorage' in window ? window.sessionStorage : defaultStore;
    case 'memory':
    default:
      return defaultStore;
  }
};

const Storage = {
  /**
   * Install plugin
   *
   * @param {Object} Vue
   * @param {Object} options
   * @returns {WebStorage}
   */
  install(Vue, options = {}) {
    const storageOption = options.storage || 'local';
    const store = storageResolver(storageOption, options);

    const _options = {
      ...options,
      ...{
        storage: store,
        storageType: storageOption,
        name: options.name || 'ls',
      },
    };

    const ls = new WebStorage(store);

    ls.setOptions({ ...ls.options, namespace: '', ..._options });

    Vue[_options.name] = ls; // eslint-disable-line

    if (Vue.prototype[`$${options.name}`]) return;

    Object.defineProperty(Vue.prototype, `$${_options.name}`, {
      get() {
        return ls;
      },
    });
  },
};

window.VStorage = Storage;
export { Storage };
