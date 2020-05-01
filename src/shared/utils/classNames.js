/**
 * Generate class name.
 *
 * @param {String} className
 * @param {String[]} suffixes e.g., `['sm', 'lg']`
 * @param {String} separator
 * @return {String[]} Array of suffixed classes.
 */
export function makeClassName(className, suffix, separator = '-') {
  if (suffix) {
    return `${className}${separator}${suffix}`;
  }
  return className;
}

/**
 * Create a suffixed class name.
 *
 * @param {String} className
 * @param {String[]} suffixes e.g., `['sm', 'lg']`
 * @return {String[]} Array of suffixed classes.
 */
export const appendSuffixToClassName = (className, suffix, separator = '-') =>
  `${className}${separator}${suffix}`;

/**
 * Create an array of suffixed classes from a class name.
 *
 * @param {String} className
 * @param {String[]} suffixes e.g., `['sm', 'lg']`
 * @return {String[]} Array of suffixed classes.
 */
export const appendSuffixesToClassName = (className, suffixes, separator = '-') => {
  const classList = [];

  suffixes.forEach((suffix) => {
    classList.push(`${className}${separator}${suffix}`);
  });

  return classList;
};

export const generateSuffixedClassNames = (className, suffixes, separator = '-') => {
  // Remove any trailing hyphen at the end of the class name.
  className.replace(/-$/, '');

  const classList = [];

  let index = 0;

  if (Array.isArray(suffixes[0])) {
    while (index < suffixes.length) {
      const suffixList = suffixes[index];

      if (!Array.isArray(className)) {
        classList.push(...appendSuffixesToClassName(className, suffixList, separator));
        className = classList;
      } else {
        className.forEach((klass) => {
          classList.push(...appendSuffixesToClassName(klass, suffixList, separator));
        });
      }

      index++;
    }
  } else {
    classList.push(...appendSuffixesToClassName(className, suffixes, separator));
  }

  return classList.join(' ');
};
