import { MICO_COMPONENT_SIZES } from '../const';
import { appendSuffixToClassName, propertyValidator } from '@/shared/utils';

/**
 * The props and setter method can be used separately for functional components or
 * together form importing into the `mixins: []` array of a standard component definition.
 */

export const size = {
  type: String,
  default: null,
  validator: (value) => propertyValidator(value, MICO_COMPONENT_SIZES),
};

export const setComponentSizeClass = (className, sizeOption) => {
  if (sizeOption) {
    return appendSuffixToClassName(className, sizeOption);
  }
  return '';
};

export const sizable = {
  props: {
    size: {
      type: String,
      default: null,
      validator: (value) => propertyValidator(value, MICO_COMPONENT_SIZES),
    },
  },

  methods: {
    setComponentSizeClass(className, computedSize) {
      const _size = !computedSize ? this.size : computedSize;

      if (_size) {
        return appendSuffixToClassName(className, _size);
      }
    },
  },
};
