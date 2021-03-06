/**
 * vue-functional-data-merge 2.0.3
 * @author Alex Regan
 * @see {@link https://github.com/alexsasharegan/vue-functional-data-merge}
 *
 * Intelligently merges data for createElement.
 * Merges arguments left to right, preferring the right argument.
 * Returns new VNodeData object.
 */
export function mergeData(...args) {
  /* eslint-disable */
  /* prettier-ignore */
  /* tslint:disable */
  const mergeTarget = {};
  let i = args.length;
  let prop;
  let event;

  // Allow for variadic argument length.
  while (i--) {
    // Iterate through the data properties and execute merge strategies
    // Object.keys eliminates need for hasOwnProperty call
    for (prop of Object.keys(args[i])) {
      switch (prop) {
        // Array merge strategy (array concatenation)
        case 'class':
        case 'style':
        case 'directives':
          if (!Array.isArray(mergeTarget[prop])) {
            mergeTarget[prop] = [];
          }
          // Repackaging in an array allows Vue runtime
          // to merge class/style bindings regardless of type.
          mergeTarget[prop] = mergeTarget[prop].concat(args[i][prop]);
          break;
        // Space delimited string concatenation strategy
        case 'staticClass':
          if (!args[i][prop]) {
            break;
          }
          if (mergeTarget[prop] === undefined) {
            mergeTarget[prop] = '';
          }
          if (mergeTarget[prop]) {
            // Not an empty string, so concatenate
            mergeTarget[prop] += ' ';
          }
          mergeTarget[prop] += args[i][prop].trim();
          break;
        // Object, the properties of which to merge via array merge strategy (array concatenation).
        // Callback merge strategy merges callbacks to the beginning of the array,
        // so that the last defined callback will be invoked first.
        // This is done since to mimic how Object.assign merging
        // uses the last given value to assign.
        case 'on':
        case 'nativeOn':
          if (!mergeTarget[prop]) {
            mergeTarget[prop] = {};
          }
          for (event of Object.keys(args[i][prop] || {})) {
            // Concat function to array of functions if callback present.
            if (mergeTarget[prop][event]) {
              // Insert current iteration data in beginning of merged array.
              mergeTarget[prop][event] = [].concat(mergeTarget[prop][event], args[i][prop][event]);
            } else {
              // Straight assign.
              mergeTarget[prop][event] = args[i][prop][event];
            }
          }
          break;
        // Object merge strategy
        case 'attrs':
        case 'props':
        case 'domProps':
        case 'scopedSlots':
        case 'staticStyle':
        case 'hook':
        case 'transition':
          if (!mergeTarget[prop]) {
            mergeTarget[prop] = {};
          }
          mergeTarget[prop] = { ...args[i][prop], ...mergeTarget[prop] };
          break;
        // Reassignment strategy (no merge)
        case 'slot':
        case 'key':
        case 'ref':
        case 'tag':
        case 'show':
        case 'keepAlive':
        default:
          if (!mergeTarget[prop]) {
            mergeTarget[prop] = args[i][prop];
          }
      }
    }
  }

  return mergeTarget;
}
