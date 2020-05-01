const allListenTypes = { hover: true, click: true, focus: true };

const MICO_BOUND_LISTENERS = '__MICO_BOUND_LISTENERS__';

export const target = {
  bind(vnode, binding, listenTypes, fn) {
    const targets = Object.keys(binding.modifiers || {}).filter((t) => !allListenTypes[t]);

    if (binding.value) {
      targets.push(binding.value);
    }

    const listener = () => {
      fn({ targets, vnode });
    };

    Object.keys(allListenTypes).forEach((type) => {
      if (listenTypes[type] || binding.modifiers[type]) {
        vnode.addEventListener(type, listener);

        const boundListeners = vnode.elm[MICO_BOUND_LISTENERS] || {};

        boundListeners[type] = boundListeners[type] || [];
        boundListeners[type].push(listener);
        vnode.elm[MICO_BOUND_LISTENERS] = boundListeners;
      }
    });

    // Return the list of targets
    return targets;
  },
  unbind(vnode, binding, listenTypes) {
    Object.keys(allListenTypes).forEach((type) => {
      if (listenTypes[type] || binding.modifiers[type]) {
        const boundListeners =
          vnode.elm[MICO_BOUND_LISTENERS] && vnode.elm[MICO_BOUND_LISTENERS][type];

        if (boundListeners) {
          boundListeners.forEach((listener) => vnode.elm.removeEventListener(type, listener));
          delete vnode.elm[MICO_BOUND_LISTENERS][type];
        }
      }
    });
  },
};
