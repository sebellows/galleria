/**
 * Key Codes (events)
 */
import { range } from './common';

export const SPACE = 32;
export const ENTER = 13;
export const ESCAPE = 27;
export const LEFT = 37;
export const UP = 38;
export const RIGHT = 39;
export const DOWN = 40;
export const PAGEUP = 33;
export const PAGEDOWN = 34;
export const HOME = 36;
export const END = 35;
export const TAB = 9;
export const SHIFT = 16;
export const CTRL = 17;
export const BACKSPACE = 8;
export const ALT = 18;
export const PAUSE = 19;
export const BREAK = 19;
export const INSERT = 45;
export const INS = 45;
export const DELETE = 46;
export const F7 = 118;
export const PERIOD = 190;
export const META = 91; // WIN_KEY_LEFT
export const MAC_META = 224;

// Keys '0' through '9' for both standard number keys and number-pad keys.
export const numberKeyCodes = [...range(48, 57), ...range(96, 105)];

export const isNumberKey = (key) => numberKeyCodes.includes(key);
export const isArrowKey = (key) => [UP, DOWN, LEFT, RIGHT].includes(key);
export const isMetaKey = (key) => [META, MAC_META].includes(key);

/**
 * Checks whether a modifier key is pressed.
 *
 * @param {KeyboardEvent} event Event to be checked
 * @param {...String} modifiers One or more modifier keys ('altKey', 'shiftKey', etc.)
 */
export function hasModifierKey(event, ...modifiers) {
  if (modifiers.length) {
    return modifiers.some((modifier) => event[modifier]);
  }

  return event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
}
