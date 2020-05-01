/* eslint-disable no-unused-vars */
import { Store, get, set, keys, del, clear } from 'idb-keyval';

/**
 * See {@link http://lea.verou.me/2016/12/resolve-promises-externally-with-this-one-weird-trick/}
 */
function deferPromise() {
  let res, rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });

  promise.resolve = res;
  promise.reject = rej;

  return promise;
}
const _deferred = deferPromise();

export class IDBStorage {
  constructor(dbName = 'keyval-store', storeName = 'keyval') {
    this.store = new Store(dbName, storeName);

    Object.defineProperty(this, 'length', {
      /**
       * Define length property
       *
       * @return {number}
       */
      get() {
        const _keys = _deferred.then(keys(this.store));
        return _keys.length;
      },
    });
  }

  /**
   * Get item
   *
   * @param {string} name
   * @returns {*}
   */
  getItem(name) {
    return get(name, this.store).then((item) => item);
    // return value;
  }

  /**
   * Set item
   *
   * @param {string} name
   * @param {*} value
   * @returns {boolean}
   */
  async setItem(name, value) {
    await set(name, value, this.store);

    return true;
  }

  /**
   * Remove item
   *
   * @param {string} name
   * @returns {boolean}
   */
  async removeItem(name) {
    const deleted = await del(name, this.store);
    return deleted;
  }

  /**
   * Clear storage
   *
   * @returns {boolean}
   */
  async clear() {
    await clear();

    return true;
  }

  /**
   * Get item by key
   *
   * @param {number} index
   * @returns {*}
   */
  async key(index) {
    const _keys = await keys();
    const key = _keys[index] !== 'undefined' ? _keys[index] : null;

    return key ? this.get(key) : null;
  }
}
