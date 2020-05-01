/**
 * The value must match either an option in the `sizes` array or be
 * an array of containing matches.
 *
 * @param {String, String[]} size
 */
export const propertyValidator = (prop, options) => {
  if (!options || !Array.isArray(options)) {
    console.warn(
      `An array of options was not passed to the \`propertyValidator\` function for the component prop "${prop}"`,
    );
    return false;
  }

  return (
    !!~options.indexOf(prop) || (Array.isArray(prop) && prop.some((opt) => !!~options.indexOf(opt)))
  );
};
