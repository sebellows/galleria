import { isFunction, noop } from '../utils/common';

const isTouch =
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.msMaxTouchPoints > 0);
const events = isTouch ? ['touchstart', 'click'] : ['click'];

function processDirectiveArguments(bindingValue) {
  // if (!isFunction && typeof bindingValue !== 'object') {
  //     throw new Error('v-click-outside: Binding value must be a function or an object');
  // }
  if (!bindingValue) {
    bindingValue = noop;
  }

  return {
    handler: isFunction(bindingValue) ? bindingValue : bindingValue.handler,
    middleware: bindingValue.middleware || ((isClickOutside) => isClickOutside),
    events: bindingValue.events || events,
  };
}

function onEvent({ el, evt, handler, middleware }) {
  const isClickOutside = evt.target !== el && !el.contains(evt.target);

  if (!isClickOutside) return;

  if (middleware(evt, el)) handler(evt, el);
}

const instances = [];

export const clickOutside = {
  instances,

  bind(el, { value }) {
    const { handler, middleware, events } = processDirectiveArguments(value);

    const instance = {
      el,
      eventHandlers: events.map((eventName) => ({
        event: eventName,
        handler: (evt) => onEvent({ evt, el, handler, middleware }),
      })),
    };

    instance.eventHandlers.forEach(({ event, handler }) =>
      document.addEventListener(event, handler),
    );
    instances.push(instance);
  },

  update(el, { value }) {
    const { handler, middleware, events } = processDirectiveArguments(value);
    const instance = instances.find((instance) => instance.el === el);

    instance.eventHandlers.forEach(({ evt, handler }) =>
      document.removeEventListener(evt, handler),
    );

    instance.eventHandlers = events.map((eventName) => ({
      event: eventName,
      handler: (evt) => onEvent({ evt, el, handler, middleware }),
    }));

    instance.eventHandlers.forEach(({ evt, handler }) => document.addEventListener(evt, handler));
  },

  unbind(el) {
    const instance = instances.find((instance) => instance.el === el);

    instance.eventHandlers.forEach(({ evt, handler }) =>
      document.removeEventListener(evt, handler),
    );
  },
};
