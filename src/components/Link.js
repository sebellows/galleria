import { except, mergeData, only } from '@/shared/utils';

export function linkPropsFactory() {
  return {
    active: {
      type: Boolean,
      default: false,
    },
    activeClass: {
      type: String,
      default: 'active',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    event: {
      type: [String, Array],
      default: 'click',
    },
    href: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    target: {
      type: String,
      default: '_self',
    },
    to: {
      type: Object,
      default: null,
    },
  };
}

export const linkPropsInstance = linkPropsFactory();

export function pickLinkProps(...props) {
  const freshLinkProps = linkPropsFactory();

  return only(freshLinkProps, ...props);
}

export function omitLinkProps(...props) {
  const freshLinkProps = linkPropsFactory();

  return except(freshLinkProps, ...props);
}

export const computed = {
  linkProps() {
    const linkProps = {};
    const propKeys = Object.keys(linkPropsFactory());

    for (let i = 0; i < propKeys.length; i++) {
      const prop = propKeys[i];
      // Computed Vue getters are bound to the instance.
      linkProps[prop] = this[prop];
    }

    return linkProps;
  },
};

function clickHandlerFactory({ disabled, tag, href, suppliedHandler, parent }) {
  const isRouterLink = tag === 'router-link';

  return function onClick(e) {
    if (disabled && e instanceof Event) {
      // Stop event from bubbling up.
      e.stopPropagation();
      // Kill the event loop attached to this specific EventTarget.
      e.stopImmediatePropagation();
    } else {
      parent.$root.$emit('mico-link:clicked', e);

      if (isRouterLink && e.target.__vue__) {
        e.target.__vue__.$emit('click', e);
      }
      if (typeof suppliedHandler === 'function') {
        suppliedHandler(...arguments);
      }
    }

    if ((!isRouterLink && href === '#') || disabled) {
      // Stop scroll-to-top behavior or navigation.
      e.preventDefault();
    }
  };
}

export default {
  name: 'mico-link',

  functional: true,

  props: linkPropsFactory(),

  render(h, { props, data, parent, children }) {
    const tag = Boolean(parent.$router) && props.to && !props.disabled ? 'router-link' : 'a';
    const rel = props.target === '_blank' && props.rel === null ? 'noopener' : props.rel || null;
    const href = tag === 'router-link' ? void 0 : props.href || '#';
    const eventType = tag === 'router-link' ? 'nativeOn' : 'on';
    const suppliedHandler = (data[eventType] || {}).click;
    const handlers = {
      click: clickHandlerFactory({
        tag,
        href,
        disabled: props.disabled,
        suppliedHandler,
        parent,
      }),
    };

    const componentData = mergeData(data, {
      class: [props.active ? props.activeClass : null, { disabled: props.disabled }],
      attrs: {
        rel,
        href,
        target: props.target,
        tabindex: props.disabled ? '-1' : data.attrs ? data.attrs.tabindex : null,
        'aria-disabled': tag === 'a' && props.disabled ? 'true' : null,
      },
      props: Object.assign(props, { tag }),
    });

    // If href prop exists on router-link (even undefined or null) it fails working on SSR.
    if (!componentData.attrs.href) {
      delete componentData.attrs.href;
    }

    // We want to overwrite any click handler since our callback
    // will invoke the supplied handler if !props.disabled
    componentData[eventType] = Object.assign(componentData[eventType] || {}, handlers);

    return h(tag, componentData, children);
  },
};
