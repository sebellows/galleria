import { omitLinkProps } from './Link';
import { mergeData, unwrap } from '../shared/utils';
import { size, variant, setComponentSizeClass, setVariantClass } from '@/shared/mixins';

const buttonProps = {
  block: {
    type: Boolean,
    default: false,
  },
  href: {
    type: String,
    default: null,
  },
  iconButton: {
    type: Boolean,
    default: false,
  },
  isToggle: {
    type: Boolean,
    default: false,
  },
  // Should the button text not wrap?
  nowrap: {
    type: Boolean,
    default: false,
  },
  outline: {
    type: Boolean,
    default: false,
  },
  pressed: {
    // tri-state prop: true, false or null
    // => on, off, not a toggle
    type: Boolean,
    default: null,
  },
  tag: {
    type: String,
    default: 'button',
  },
  type: {
    type: String,
    default: 'button',
  },
  to: {
    type: [String, Object],
    default: null,
  },
  size,
  variant,
};

const linkProps = omitLinkProps('href', 'to');
const props = { ...linkProps, ...buttonProps };

// Focus handler for toggle buttons.  Needs class of 'focus' when focused.
// eslint-disable-next-line no-unused-vars
function handleFocus(evt) {
  if (evt.type === 'focusin') {
    evt.target.classList.add('focus');
  } else if (evt.type === 'focusout') {
    evt.target.classList.remove('focus');
  }
}

// Is the requested button a link?
function isLink(props) {
  // If tag prop is set to `a`, we use a b-link to get proper disabled handling
  return Boolean(props.href || props.to || (props.tag && String(props.tag).toLowerCase() === 'a'));
}

// Is the button to be a toggle button?
function isToggle(props) {
  return typeof props.pressed === 'boolean';
}

// Is the button "really" a button?
function isButton(props) {
  if (isLink(props)) {
    return false;
  } else if (props.tag && String(props.tag).toLowerCase() !== 'button') {
    return false;
  }
  return true;
}

function isNonStandardTag(props) {
  return !isLink(props) && !isButton(props);
}

function computeClass(props) {
  const baseClassName = props.outline ? 'btn-outline' : 'btn';
  return [
    setVariantClass(baseClassName, props.variant),
    setComponentSizeClass('btn', props.size),
    {
      ['btn-block']: props.block,
      ['btn-icon']: props.iconButton,
      ['btn-link']: props.href,
      ['active']: props.active,
      ['disabled']: props.disabled,
      ['text-nowrap']: props.nowrap,
    },
  ];
}

// Compute the attributes for a button
function computeAttrs(props, data) {
  const button = isButton(props);
  const link = isLink(props);
  const toggle = isToggle(props);
  const nonStdTag = isNonStandardTag(props);
  const role = data.attrs && data.attrs['role'] ? data.attrs['role'] : null;
  let tabindex = data.attrs ? data.attrs['tabindex'] : null;

  if (nonStdTag) tabindex = '0';

  return {
    // Type only used for "real" buttons
    type: button && !link ? props.type : null,
    // Disabled only set on "real" buttons
    disabled: button ? props.disabled : null,
    // We add a role of button when the tag is not a link or button for ARIA.
    // Don't bork any role provided in data.attrs when isLink or isButton
    role: nonStdTag ? 'button' : role,
    // We set the aria-disabled state for non-standard tags
    'aria-disabled': nonStdTag ? String(props.disabled) : null,
    // For toggles, we need to set the pressed state for ARIA
    'aria-pressed': toggle ? String(props.pressed) : null,
    // autocomplete off is needed in toggle mode to prevent some browsers from
    // remembering the previous setting when using the back button.
    autocomplete: toggle ? 'off' : null,
    // Tab index is used when the component is not a button.
    // Links are tabbable, but don't allow disabled, while non buttons or links
    // are not tabbable, so we mimic that functionality by disabling tabbing
    // when disabled, and adding a tabindex of '0' to non buttons or non links.
    tabindex: props.disabled && !button ? '-1' : tabindex,
  };
}

export default {
  name: 'mico-button',

  functional: true,

  props,

  render(h, context) {
    const { children, data, listeners, props } = context;
    const link = isLink(props);
    // eslint-disable-next-line no-unused-vars
    const toggle = isToggle(props);
    const on = {
      click(evt) {
        // Ensure click on button HTML content is also disabled
        if (props.disabled && evt instanceof Event) {
          evt.stopPropagation();
          evt.preventDefault();
        } else if (props && listeners && listeners['update:pressed']) {
          const pressed = unwrap(listeners['update:pressed']);
          pressed.forEach((fn) => {
            if (typeof fn === 'function') {
              fn(!props.pressed);
            }
          });
        }
      },
    };

    let _tag = 'button';

    if (link) {
      if (props.to) {
        _tag = 'router-link';
      } else {
        _tag = 'a';
      }
    }
    if (props.type === 'submit') _tag = 'input';

    const componentData = {
      staticClass: 'btn',
      class: computeClass(props),
      attrs: computeAttrs(props, data),
      props: { to: props.to || null },
      on,
    };

    return h(_tag, mergeData(data, componentData), children);
  },
};
