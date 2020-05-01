export class StorageEvent {
  listeners = {};

  /**
   * Add storage change event
   *
   * @param {string} name
   * @param {Function} callback
   */
  static on(name, callback) {
    if (typeof this.listeners[name] === 'undefined') {
      this.listeners[name] = [];
    }

    this.listeners[name].push(callback);
  }

  /**
   * Remove storage change event
   *
   * @param {string} name
   * @param {Function} callback
   */
  static off(name, callback) {
    if (this.listeners[name].length) {
      this.listeners[name].splice(this.listeners[name].indexOf(callback), 1);
    } else {
      this.listeners[name] = [];
    }
  }

  /**
   * Emit event
   *
   * @param {Object} event
   */
  static emit(event) {
    const e = event || window.event;

    const getValue = (data) => {
      try {
        return JSON.parse(data).value;
      } catch (err) {
        return data;
      }
    };

    const fire = (listener) => {
      const newValue = getValue(e.newValue);
      const oldValue = getValue(e.oldValue);

      listener(newValue, oldValue, e.url || e.uri);
    };

    if (!e || !e.key) return;

    const all = this.listeners[e.key];

    if (all && all.length) {
      all.forEach(fire);
    }
  }
}
