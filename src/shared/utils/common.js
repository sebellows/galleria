/* eslint-disable eqeqeq */
/* eslint-disable no-useless-escape */

export const isNode = (value) => value && value.nodeType === Node.ELEMENT_NODE;
export const isSVG = (value) => value && value instanceof SVGElement;

/** Checks if an element is actually an Observer coming from Vue. */
export const isObserver = (value) =>
  typeof value === 'object' &&
  value.__ob__ &&
  value.__ob__.__proto__.constructor.name === 'Observer';

export const typeOf = (obj, is) => {
  if (isNode(obj)) {
    return is ? is === 'node' : 'node';
  }
  if (isObserver(obj)) {
    return is ? is === 'observer' : 'observer';
  }
  const type = Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();
  return is ? type === is : type;
};

export const isNil = (value) => value === undefined || value === null;
export const isDefined = (value) => !isNil(value);
export const isBoolean = (value) => typeOf(value, 'boolean');
export const isFunction = (value) => typeOf(value, 'function');
export const isNumber = (value) => typeOf(value, 'number');
export const isObject = (value) => typeof value === 'object';
export const isPlainObject = (value) => typeOf(value, 'object');
export const isString = (value) => typeOf(value, 'string');

export const isEmpty = (value) => {
  if (Array.isArray(value) || typeof value == 'string') {
    return value.length > 0;
  }
  if (isPlainObject(value)) {
    return Object.keys(value).length > 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size > 0;
  }
  if (typeof value == 'number') {
    return value > 0;
  }

  return false;
};

export const isConstructor = (fn) => {
  try {
    new fn();
  } catch (err) {
    if (/is not a constructor/.test(err.message)) {
      return false;
    }
  }
  return true;
};

/** No operation. */
export const noop = () => {};

/** Check whether an object has the property. */
export const hasOwn = (obj, key) => {
  return (
    Object.prototype.hasOwnProperty.call(obj, key) ||
    !isNil(Object.getOwnPropertyDescriptor(obj, key))
  );
};

export const toBoolean = (value) => !isNil(value) && `${value}` !== 'false';

/** Create a memoized version of a pure function. */
const cached = {};
export const memoize = (fn, cache = cached) => {
  return function cachedFn(str) {
    return cache[str] || (cache[str] = fn(str));
  };
};

/** Pascal-ize a hyphen-delimited string. */
export const pascalize = memoize(function(str) {
  return str.replace(/-(\w)/g, function(_, c) {
    return c ? c.toUpperCase() : '';
  });
});

/** Capitalize a string. */
export const capitalize = memoize((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

/** Camelize a string. */
export const camelize = memoize((str) => {
  const _str = pascalize(str);
  return _str.charAt(0).toLowerCase() + _str.slice(1);
});

/** Hyphenate a string. */
export const hyphenate = memoize((str) => {
  return String(str)
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase();
});

/**
 * Minimalistic version of `Object.assign()` that assigns only non-prototype properties.
 *
 * @param {Object}   dest  An accumulator object that will be assigned to.
 * @param {Object[]} src   The objects to assign to the accumulator.
 * @return {Object}
 */
export function assign(dest, src) {
  for (const key in src) {
    if (hasOwn(dest, key)) {
      dest[key] = src[key];
    }
  }
  return dest;
}

/**
 * Check if an array was passed to the rest arguments and extract
 * it if so. Otherwise, return the rest arguments.
 *
 * @see {@link https://github.com/ecrmnn/collect.js|collect.js}
 * @author Daniel Eckermann <http://danieleckermann.com/>
 * @copyright © Daniel Eckermann
 * @license MIT
 *
 * @param {*} args
 * @returns {Array}
 */
export function unwrap(...args) {
  return Array.isArray(args[0]) ? args[0] : args;
}

/**
 * Return only items that DO CONTAIN the specified keys.
 *
 * @param {Array|Object} items
 * @param {String[]} keys
 * @return {Array|Object}
 */
export function only(items, ...keys) {
  const properties = unwrap(keys);

  if (Array.isArray(items)) {
    return items.filter((item) => !!~properties.indexOf(item));
  }

  return Object.entries(items).reduce((collection, [key, value]) => {
    if (properties.includes(key)) {
      collection[key] = value;
    }
    return collection;
  }, {});
}

/**
 * Return items that DO NOT CONTAIN the specified keys.
 *
 * @param {Array|Object} items
 * @param {String[]} keys
 * @return {Array|Object}
 */
export function except(items, ...args) {
  const properties = unwrap(args);

  if (Array.isArray(items)) {
    return items.filter((item) => !properties.includes(item));
  }

  return Object.entries(items).reduce((collection, [key, value]) => {
    if (!properties.includes(key)) {
      collection[key] = value;
    }
    return collection;
  }, {});
}

/**
 * Parse and validate a dot-notation path.
 *
 * @see {@link http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621}
 *
 * @param {*} path     Dot-notation string
 * @param {*} fallback A default value to fallback to
 */
function makeValidPath(path, fallback) {
  if (!path || path.constructor !== String) return fallback;

  // convert indexes to properties
  path = path.replace(/\[(\w+)\]/g, '.$1');
  // strip a leading dot
  path = path.replace(/^\./, '');

  return path.split('.');
}

/**
 * Get a property from a nested object using a dot path.
 *
 * @param {*} obj
 * @param {Array<String|Number>} path
 * @param {*} fallback
 * @returns {*}
 */
export function getDeepValue(obj, path, fallback) {
  try {
    const pathArr = makeValidPath(path);
    return pathArr.reduce((acc, segment) => acc[segment], obj);
  } catch (err) {
    return fallback !== void 0 ? fallback : err;
  }
}

export function clone(obj) {
  if (Array.isArray(obj)) {
    return obj.map((o) => {
      if (Array.isArray(o) || isPlainObject(o)) {
        return clone(0);
      }
      return o;
    });
  }
  if (isPlainObject(obj) || isObserver(obj)) {
    return Object.entries(obj).reduce((newObj, [k, v]) => {
      if (Array.isArray(v) || isPlainObject(v)) {
        newObj[k] = clone(v);
      } else {
        newObj[k] = v;
      }
      return newObj;
    }, {});
  }
  return obj;
}

/**
 * Generate a range of numbers.
 *
 * @param {Number} start The number range should start at.
 * @param {Number} stop  The number range should end at.
 * @param {Number} step  The length between two points within the range.
 * @return {Number[]}    An array of numbers denoting the steps in range.
 */
export function range(start, stop, step = 1) {
  if (!stop) {
    stop = start;
    start = 0;
  }
  if (start === 1) {
    stop += 1;
  }

  // eslint-disable-next-line no-unused-vars
  return Array.from({ length: (stop - start) / step }, (_, i) => start++ * step);
}

const supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;

function isTransform(value) {
  return !!(value && supportedTransforms.test(value));
}

/**
 * Get a node's computed styles.
 *
 * @param {Element} node The Element for which to get the computed style
 * @param {String} [psuedoElement] A pseudo-element to match
 */
function getComputedStyle(node, psuedoElement) {
  return window.getComputedStyle(node, psuedoElement);
}

/**
 * Delay the resolution of a value in hopes you get a treat.
 *
 * @param {*} value  Value to hopefully resolve (if you're lucky!)
 * @param {Number} t Time in milliseconds to wait
 * @returns {Promise}
 */
export async function defer(value, t = 0) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, value), t);
  });
}

/**
 * Set inline styles on an Element.
 *
 * @param {Element|Object} nodeOrObj
 * @param {String|Object} property
 * @returns {String|void}
 */
export function styles(nodeOrObj, property) {
  const transforms = [];

  if (!isNode(nodeOrObj) && isPlainObject(nodeOrObj) && !property) {
    return Object.entries(nodeOrObj)
      .reduce((css, [prop, value]) => (css += `${prop}: ${value};`), [])
      .join(' ');
  }

  if (isNode(nodeOrObj) && isString(property)) {
    return (
      nodeOrObj.style.getPropertyValue(hyphenate(property)) ||
      getComputedStyle(nodeOrObj).getPropertyValue(hyphenate(property))
    );
  }

  const cssText = Object.entries(property).reduce((css, [key, value], i) => {
    const propKey = isTransform(key) ? key : hyphenate(key);

    if (isNil(value)) {
      nodeOrObj.style.removeProperty(propKey);
    } else if (isTransform(key)) {
      transforms.push(`${key}(${value})`);
    }
    if (i === Object.entries(property).length - 1 && transforms.length) {
      return (css += `transform: ${transforms.join(' ')};`);
    }
    return (css += `${hyphenate(key)}: ${value};`);
  }, '');

  nodeOrObj.style.cssText += cssText;
}

/**
 * Sort a collection.
 *
 * @param {object[]} items
 * @param {(a: any, b: any) => number} fn
 * @return {object[]}
 */
export function sort(items, fn) {
  const collection = [].concat(items);

  if (!fn) {
    if (collection.every((item) => isNumber(item))) {
      collection.sort((a, b) => a - b);
    } else {
      collection.sort();
    }
    return collection;
  }
  return collection.sort(fn);
}

export function compare(items, valueOrFunction) {
  const collection = [...items];

  if (typeof valueOrFunction === 'function') {
    // Call `fn` on specified property of each and then compare.
    sort(collection, (a, b) => {
      if (valueOrFunction(a) < valueOrFunction(b)) return -1;
      if (valueOrFunction(a) > valueOrFunction(b)) return 1;

      return 0;
    });
  } else {
    // Do a simple comparison.
    sort(collection, (a, b) => {
      if (a[valueOrFunction] < b[valueOrFunction]) return -1;
      if (a[valueOrFunction] > b[valueOrFunction]) return 1;

      return 0;
    });
  }

  return collection;
}

/**
 * Do a shallow equal comparison on two objects.
 *
 * @param {Object} objA
 * @param {Object} objB
 * @returns {Boolean}
 */
export const shallowCompare = (objA, objB) => {
  if (typeOf(objA) !== typeOf(objB)) {
    return false;
  }
  if (Array.isArray(objA) && Array.isArray(objB)) {
    if (objA.length !== objB.length) return false;
    return objA.every((item, i) => Object.is(item, objB[i]));
  }
  if (isDefined(objA) && isDefined(objB) && isPlainObject(objA) && isPlainObject(objB)) {
    if (Object.keys(objA).length !== Object.keys(objB).length) return false;
    return Object.keys(objA).every((key) => Object.is(objA[key], objB[key]));
  }
  return Object.is(objA, objB);
};

/**
 * Find a match in a given collection array or object.
 *
 * @param {Array} items The collection to search over
 * @param {*} valueOrFunction Either a value or a callback to run on the items array
 * @param {*} strict Whether or not to do a strict equals comparison
 */
export function search(items, valueOrFunction, strict) {
  let result;

  const find = (item, key) => {
    if (isFunction(valueOrFunction)) {
      return valueOrFunction(item, key);
    }

    return strict ? item === valueOrFunction : item == valueOrFunction;
  };

  if (Array.isArray(items)) {
    result = items.findIndex(find);
  } else if (isObject(items)) {
    result = Object.keys(items).find((key) => find(items[key], key));
  }

  if (isNil(result) || result < 0) {
    return false;
  }

  return result;
}
