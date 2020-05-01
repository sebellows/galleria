import { MICO_VARIANTS, MICO_YIQ_VARIANTS } from '@/shared/const';
import { appendSuffixToClassName, propertyValidator } from '@/shared/utils';

/**
 * The props and setter method can be used separately for functional components or
 * together form importing into the `mixins: []` array of a standard component definition.
 */

export const variant = {
  type: String,
  default: null,
  validator: (value) => propertyValidator(value, MICO_VARIANTS),
};

export const setVariantClass = (
  className,
  variantName,
  invert = false,
  yiqVariantName = 'body',
) => {
  if (variantName) {
    if (invert) {
      const variantClasses = [appendSuffixToClassName(className, variantName)];

      if (~MICO_YIQ_VARIANTS.indexOf(variantName)) {
        variantClasses.push(appendSuffixToClassName('text', yiqVariantName));
      } else {
        variantClasses.push('text-white');
      }
      return variantClasses.join(' ');
    }
    return appendSuffixToClassName(className, variantName);
  }
  return '';
};

export const variantable = {
  props: {
    variant,
  },

  methods: {
    setVariantClass(className, computedVariant, invert = false, yiqVariantName = 'body') {
      const _variant = !computedVariant ? this.variant : computedVariant;

      if (_variant) {
        return setVariantClass(className, _variant, invert, yiqVariantName);
      }
    },
  },
};
