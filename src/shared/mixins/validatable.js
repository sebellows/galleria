/**
 * Form control contextual state class computation.
 *
 * Returned class is either 'is-valid' or 'is-invalid' based on the 'state' prop
 * state can be one of five values:
 *  - true or 'valid' for is-valid
 *  - false or 'invalid' for is-invalid
 *  - null (or empty string) for no contextual state
 */

export const validatable = {
  props: {
    state: {
      // true/'valid', false/'invalid', '',null
      // The order must be String first, then Boolean!
      type: [String, Boolean],
      default: null,
    },
  },

  data() {
    return {
      isValid: true,
    };
  },

  computed: {
    validationClass() {
      switch (this.state) {
        case true:
        case 'valid':
          this.isValid = true;
          return 'is-valid';
        case false:
        case 'invalid':
          this.isValid = false;
          return 'is-invalid';
        default:
          return null;
      }
    },
  },
};
