import { isNode, isPlainObject, isString } from './common';

export const isVisible = (el) => {
  if (!isNode(el)) return false;
  return (
    document.body.contains(el) &&
    el.getBoundingClientRect().height > 0 &&
    el.getBoundingClientRect().width > 0
  );
};

/**
 * Strip <script> tags from string
 *
 * Given an string, removes all occurences of HTML <script> tags
 *
 * @param {String} str
 * @return {String}
 */
export const stripScripts = (str = '') =>
  String(str).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

/**
 * Observe a DOM element changes, falls back to eventListener mode
 *
 * @param {Element} el The DOM element to observe
 * @param {Function} callback callback to be called on change
 * @param {object} [opts={childList: true, subtree: true}] observe options
 *
 * @see http://stackoverflow.com/questions/3219758
 */
export const observe = (target, callback, opts) => {
  // Define a new observer
  const obs = new MutationObserver((mutations) => {
    let changed = false;

    // A Mutation can contain several change records, so loop through them to see what has changed.
    // The loop will be broken out of early if any significant change has been detected.
    for (let i = 0; i < mutations.length && !changed; i++) {
      // The muttion record
      const mutation = mutations[i];

      // Mutation Type
      const type = mutation.type;

      // DOM Node (could be any DOM Node type - HTMLElement, Text, comment, etc)
      const target = mutation.target;

      if (type === 'characterData' && target.nodeType === Node.TEXT_NODE) {
        // We ignore nodes that are not TEXT (i.e. comments, etc) as they don't change layout
        changed = true;
      } else if (type === 'attributes') {
        changed = true;
      } else if (
        type === 'childList' &&
        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
      ) {
        // This includes HTMLElement and Text Nodes being added/removed/re-arranged
        changed = true;
      }
    }
    if (changed) {
      // We only call the callback if a change that could affect layout/size truely happened.
      callback();
    }
  });

  // Have the observer observe foo for changes in children, etc
  obs.observe(target, { childList: true, subtree: true, ...opts });

  // We return a reference to the observer so that obs.disconnect() can be called if necessary
  // To reduce overhead when the root element is hiiden
  return obs;
};

export const domQuery = (el, rootEl) => {
  const root = !isNode(rootEl) ? document : rootEl;
  let _el = isNode(el)
    ? el
    : isString(el) && isNode(root.querySelector(el))
    ? root.querySelector(el)
    : root;

  return {
    el: _el,

    all(selector) {
      return this.el.querySelectorAll(selector);
    },

    /** Is text content overflowing in an element? */
    isTextOverflowing() {
      return this._el.offsetWidth < this._el.scrollWidth;
    },

    /** Determine if an HTML element is visible - Faster than CSS check. */
    isVisible() {
      return isVisible(this._el);
    },

    /** Determine if an element is disabled. */
    isDisabled() {
      return (
        this._el.disabled ||
        this._el.classList.contains('disabled') ||
        Boolean(this._el.getAttribute('disabled'))
      );
    },

    /** Returns true if the element contains a specified child element */
    contains(child) {
      return this._el.contains(child);
    },

    closest(selector) {
      if (isNode(this._el.closest(selector))) {
        this._el = this._el.closest(selector);
      }
      return this._el;
    },

    nextSibling() {
      if (isNode(this._el.nextSibling)) {
        this._el = this._el.nextSibling;
      }
      return this._el;
    },

    /**
     * Cause/wait-for an element to reflow it's content (adjusting it's height/width).
     * Requesting an elements offsetHight will trigger a reflow of the element content.
     */
    reflow() {
      // eslint-disable-next-line no-unused-vars
      const _ = this._el.offsetHeight;
      return this._el;
    },

    // Toggle a class to an element
    toggleClass(className) {
      if (className) {
        this._el.classList.toggle(className);
      }
      return this._el;
    },

    // Add a class to an element
    addClass(...className) {
      if (className) {
        this._el.classList.add(...className);
      }
      return this._el;
    },

    // Remove a class from an element
    removeClass(...className) {
      if (className) {
        this._el.classList.remove(...className);
      }
      return this._el;
    },

    // Test if an element has a class
    hasClass(className) {
      if (className) {
        return this._el.classList.contains(className);
      }
      return false;
    },

    /**
     * Add inline styles to an element.
     *
     * @param {HTMLElement} el
     * @param {String|Object} prop A CSS property selector or a CSS declaration block object.
     * @param {String|Undefined} [value] A value to assign to a CSS property.
     */
    addStyle(prop, value) {
      if (isPlainObject(prop)) {
        this._el.style.cssText = Object.entries(prop).reduce(
          (str, [k, v]) => `${str}${k}:${v};`,
          '',
        );
      } else if (prop && value) {
        this._el.style[prop] = value;
      }
      return this._el;
    },

    /**
     * Remove styles from an element.
     *
     * @param {HTMLElement} el
     * @param  {...String} styles One or more CSS properties.
     */
    removeStyle(...styles) {
      if (styles.length) {
        styles.forEach((style) => {
          this._el.style.removeProperty(style);
        });
      }
      return this._el;
    },

    /** Set an attribute on an element. */
    setAttr(attr, value) {
      if (attr) {
        this._el.setAttribute(attr, value);
      }
      return this._el;
    },

    /** Remove an attribute from an element. */
    removeAttr(attr) {
      if (attr && this.hasAttr(attr)) {
        this._el.removeAttribute(attr);
      }
      return this._el;
    },

    /** Get an attribute value from an element (returns null if not found). */
    getAttr(attr) {
      if (attr && this.hasAttr(attr)) {
        return this._el.getAttribute(attr);
      }
      return null;
    },

    /**
     * Determine if an attribute exists on an element
     * (returns true or false, or null if element not found).
     */
    hasAttr(attr) {
      if (attr) {
        return this._el.hasAttribute(attr);
      }
      return false;
    },

    /** Return the Bounding Client Rec of an element. Retruns null if not an element. */
    getBoundingClientRect() {
      return this._el.getBoundingClientRect() ?? null;
    },

    /** Get computed style object for an element. */
    getComputedStyle() {
      return window.getComputedStyle(this._el) ?? {};
    },

    /** Get computed style object for an element. */
    getPropertyValue(prop) {
      return getComputedStyle(this._el).getPropertyValue(prop);
    },

    getNumberFromProperty(prop) {
      return this.getPropertyValue(this._el, prop)
        .match(/\d+/g)
        .map(Number)[0];
    },

    /** Attach an event listener to an element. */
    eventOn(evtName, handler, options) {
      this._el.addEventListener(evtName, handler, options);
      return this._el;
    },

    /** Remove an event listener from an element. */
    eventOff(evtName, handler, options) {
      this._el.removeEventListener(evtName, handler, options);
      return this._el;
    },

    getScrollEventTarget() {
      while (this._el && this._el.tagName !== 'HTML' && this._el.nodeType === 1) {
        const overflowY = window.getComputedStyle(this._el).overflowY;

        if (overflowY === 'scroll' || overflowY === 'auto') {
          return this._el;
        }

        this._el = this._el.parentNode;
      }

      return window;
    },

    getScrollTop() {
      if (this._el === window) {
        return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
      } else {
        return this._el.scrollTop;
      }
    },

    getOffset() {
      const box = this._el.getBoundingClientRect();
      const body = document.body;
      const clientTop = this._el.clientTop || body.clientTop || 0;
      const clientLeft = this._el.clientLeft || body.clientLeft || 0;
      const scrollTop = window.pageYOffset || this._el.scrollTop;
      const scrollLeft = window.pageXOffset || this._el.scrollLeft;
      return {
        top: box.top + scrollTop - clientTop,
        left: box.left + scrollLeft - clientLeft,
      };
    },

    onTransitionEnd(fn) {
      const arr = ['webkitTransitionEnd', 'transitionend'];
      const handler = {
        // eslint-disable-next-line no-unused-vars
        handleEvent(event) {
          arr.forEach((eventName) => {
            this._el.removeEventListener(eventName, handler, false);
          });
          fn();
        },
      };
      arr.forEach((eventName) => {
        this._el.addEventListener(eventName, handler, false);
      });

      return this._el;
    },

    onAnimationEnd(fn) {
      const arr = ['webkitAnimationEnd', 'animationend'];
      // eslint-disable-next-line no-unused-vars
      const handler = (event) => {
        fn();
        arr.forEach((eventName) => {
          this._el.removeEventListener(eventName, handler, false);
        });
      };

      arr.forEach((eventName) => {
        this._el.addEventListener(eventName, handler, false);
      });

      return this._el;
    },

    /**
     * Observe a DOM element changes, falls back to eventListener mode
     *
     * @param {Element} el The DOM element to observe
     * @param {Function} callback callback to be called on change
     * @param {object} [opts={childList: true, subtree: true}] observe options
     *
     * @see http://stackoverflow.com/questions/3219758
     */
    observe(callback, opts) {
      // Define a new observer
      const obs = new MutationObserver((mutations) => {
        let changed = false;

        // A Mutation can contain several change records, so we loop through them to see what has changed.
        // We break out of the loop early if any "significant" change has been detected
        for (let i = 0; i < mutations.length && !changed; i++) {
          // The muttion record
          const mutation = mutations[i];

          // Mutation Type
          const type = mutation.type;

          // DOM Node (could be any DOM Node type - HTMLElement, Text, comment, etc)
          const target = mutation.target;

          if (type === 'characterData' && target.nodeType === Node.TEXT_NODE) {
            // We ignore nodes that are not TEXT (i.e. comments, etc) as they don't change layout
            changed = true;
          } else if (type === 'attributes') {
            changed = true;
          } else if (
            type === 'childList' &&
            (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
          ) {
            // This includes HTMLElement and Text Nodes being added/removed/re-arranged
            changed = true;
          }
        }
        if (changed) {
          // We only call the callback if a change that could affect layout/size truely happened.
          callback();
        }
      });

      // Have the observer observe foo for changes in children, etc
      obs.observe(this._el, Object.assign({ childList: true, subtree: true }, opts));

      // We return a reference to the observer so that obs.disconnect() can be called if necessary
      // To reduce overhead when the root element is hiiden
      return obs;
    },
  };
};
