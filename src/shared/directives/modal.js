import { target } from '../utils/target';

const listenTypes = { click: true };

export default {
  // eslint-disable-next-line no-shadow-restricted-names
  bind(el, binding, vnode) {
    const rootBus = vnode.context.$bus ?? vnode.context.$root;

    target.bind(vnode, binding, listenTypes, ({ targets, vnode }) => {
      targets.forEach((_target) => {
        rootBus.$emit('mico-modal:show', _target, vnode.elm);
      });
    });
    if (el.tagName !== 'BUTTON') {
      // If element is not a button, add `role="button"` for accessibility
      el.setAttribute('role', 'button');
    }
  },
  unbind(el, binding, vnode) {
    target.unbind(vnode, binding, listenTypes);

    if (el.tagName !== 'BUTTON') {
      // If element is not a button
      el.removeAttribute('role', 'button');
    }
  },
};
