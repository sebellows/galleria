import { StorageEvent } from './StorageEvent';

export class WebStorage {
  /**
   * @param {Object} storage
   */
  constructor(storage) {
    this.storage = storage;
    this.options = {
      namespace: '',
      events: ['storage'],
    };

    for (const i in this.options.events) {
      if (document.addEventListener) {
        document.addEventListener(this.options.events[i], StorageEvent.emit, false);
      } else if (document.attachEvent) {
        document.attachEvent(`on${this.options.events[i]}`, StorageEvent.emit);
      } else {
        document[`on${this.options.events[i]}`] = StorageEvent.emit;
      }
    }
  }

  /**
   * Define length property.
   */
  get length() {
    return Object.keys(this.storage).length;
  }

  /**
   * Set Options
   *
   * @param {Object} options
   */
  setOptions(options = {}) {
    this.options = { ...this.options, ...options };

    if (options) {
      this.options.keys = 'keys' in options ? new Map(Object.entries(options.keys)) : new Map();
    }

    // const { storage } = this.options;

    // this.storage = typeof storage === 'undefined' ? document.localStorage : storage;
  }

  _setKey(key) {
    const { keys, namespace } = this.options;

    if (keys.has(key)) {
      return namespace + keys.get(key);
    }

    return namespace + key;
  }

  /**
   * Set item
   *
   * @param {string} name
   * @param {*} value
   * @param {number} expire - seconds
   */
  set(name, value, expire = null) {
    const stringifyValue = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire : null,
    });

    this.storage.setItem(this._setKey(name), stringifyValue);
  }

  _resolve(item, def = null) {
    try {
      const data = JSON.parse(item);

      if (data.expire === null) {
        return data.value;
      }

      if (data.expire >= new Date().getTime()) {
        return data.value;
      }

      this.remove(name);
    } catch (err) {
      return def;
    }
  }

  /**
   * Get item
   *
   * @param {string} name
   * @param {*} def - default value
   * @returns {*}
   */
  get(name, def = null) {
    const item = this.storage.getItem(this._setKey(name));

    if (item) {
      if (this.options.storageType === 'idb') {
        return item.then((res) => {
          return this._resolve(res, def);
        });
      }
      return this._resolve(item, def);
    }
    return def;
  }

  /**
   * Check if item exists in storage.
   *
   * @param {string} name
   * @returns {boolean}
   */
  async has(name) {
    if (this.options.storageType === 'idb') {
      let hasItem = await this.storage.getItem(this._setKey(name));
      return !!hasItem;
    }
    return Boolean(this.storage.getItem(this._setKey(name)));
  }

  /**
   * Get item by key
   *
   * @param {number} index
   * @return {*}
   */
  key(index) {
    return this.storage.key(index);
  }

  /**
   * Remove item
   *
   * @param {string} name
   * @return {boolean}
   */
  remove(name) {
    return this.storage.removeItem(this._setKey(name));
  }

  /**
   * Clear storage
   */
  clear() {
    if (this.length === 0) {
      return;
    }

    const removedKeys = [];

    for (let i = 0; i < this.length; i++) {
      const key = this.storage.key(i);
      const regexp = new RegExp(`^${this.options.namespace}.+`, 'i');

      if (regexp.test(key) === false) {
        continue;
      }

      removedKeys.push(key);
    }

    for (const key in removedKeys) {
      this.storage.removeItem(removedKeys[key]);
    }
  }

  /**
   * Add storage change event
   *
   * @param {string} name
   * @param {Function} callback
   */
  on(name, callback) {
    StorageEvent.on(this._setKey(name), callback);
  }

  /**
   * Remove storage change event
   *
   * @param {string} name
   * @param {Function} callback
   */
  off(name, callback) {
    StorageEvent.off(this._setKey(name), callback);
  }
}
