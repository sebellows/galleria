import { mergeData } from '@/shared/utils';
import { variant, setVariantClass } from '@/shared/mixins';

export default {
  name: 'mico-close',

  functional: true,

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      default: 'Close',
    },
    closeClass: {
      type: String,
      default: null,
    },
    variant,
  },

  render(h, context) {
    const componentData = {
      staticClass: 'close',
      class: [context.props.closeClass, setVariantClass('text', context.props.variant)],
      attrs: {
        type: 'button',
        disabled: context.props.disabled,
        ['aria-label']: context.props.ariaLabel,
      },
      on: {
        click($event) {
          // Ensure click on button HTML content is also disabled
          if (context.props.disabled && $event instanceof Event) {
            $event.stopPropagation();
            $event.preventDefault();
          }
          context.listeners.click();
        },
      },
    };

    let closeIcon = context.slots().default;

    if (!context.slots().default) {
      closeIcon = h('span', { attrs: { ['aria-hidden']: true } });
      closeIcon.text = '×';
    }

    return h('button', mergeData(context.data, componentData), [closeIcon]);
  },
};
