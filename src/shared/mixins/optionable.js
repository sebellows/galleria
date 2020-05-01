import { isPlainObject } from '../utils/common';
import { stripScripts } from '../utils/dom';

export const optionable = {
  props: {
    options: {
      type: [Array, Object],
      default() {
        return [];
      },
    },
    valueField: {
      type: String,
      default: 'value',
    },
    textField: {
      type: String,
      default: 'text',
    },
    disabledField: {
      type: String,
      default: 'disabled',
    },
  },

  computed: {
    formOptions() {
      const options = this.options;

      const value = this.valueField;
      const text = this.textField;
      const disabled = this.disabledField;

      if (Array.isArray(options)) {
        // Normalize flat-ish arrays to Array of Objects
        return options.map((option) => {
          if (isPlainObject(option)) {
            const rest = {};
            Object.keys(option).forEach((key) => {
              if ([value, text, disabled].indexOf(key) === -1) {
                rest[key] = option[key];
              }
            });
            return {
              value: option[value],
              text: stripScripts(String(option[text])),
              disabled: option[disabled] || false,
              ...rest,
            };
          }
          return {
            value: option,
            text: stripScripts(String(option)),
            disabled: false,
          };
        });
      }
      // options is Object
      // Normalize Objects to Array of Objects
      return Object.keys(options).map((key) => {
        const option = options[key] || {};
        if (isPlainObject(option)) {
          const rest = {};
          Object.keys(option).forEach((key) => {
            if ([value, text, disabled].indexOf(key) === -1) {
              rest[key] = option[key];
            }
          });
          return {
            value: typeof option[value] === 'undefined' ? key : option[value],
            text: typeof option[text] === 'undefined' ? key : stripScripts(String(option[text])),
            disabled: option[disabled] || false,
            ...rest,
          };
        }
        return {
          value: key,
          text: stripScripts(String(option)),
          disabled: false,
        };
      });
    },
  },
};
