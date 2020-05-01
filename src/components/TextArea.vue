<template>
  <textarea
    :id="safeId()"
    ref="input"
    :autofocus="autofocus"
    :autocomplete="shouldAutocomplete"
    :class="computedClasses"
    :disabled="isDisabled"
    :form="form"
    :name="name"
    :placeholder="placeholder"
    :readonly="readonly"
    :required="required"
    :rows="computedRows"
    :style="computedStyle"
    :value="trueValue"
    :wrap="wrap || null"
    :aria-describedby="describedBy"
    @input="onInput"
    @change="onChange"
    @focus="onFocus"
    @blur="onBlur"
    @keydown="onKeyDown"
    @keyup="onKeyUp"
    @keypress="onKeyPress"
    @paste="onPaste"
    @reset="onReset"
  />
</template>

<script>
import { propertyValidator } from '@/shared/utils';
import TextFieldBase from './_TextFieldBase';

export default {
  name: 'mico-textarea',

  extends: TextFieldBase,

  props: {
    rows: {
      type: [Number, String],
      default: 2,
    },
    maxRows: {
      type: [Number, String],
      default: null,
    },
    wrap: {
      type: String,
      default: 'soft',
      validator: (value) => propertyValidator(value, ['soft', 'hard', 'off']),
    },
    noResize: {
      // Disable the resize handle of textarea
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      doNotResize: true,
    };
  },

  computed: {
    computedStyle() {
      return {
        // Disable resizing of the textarea (disabled by default in auto resize mode).
        resize: !this.computedRows || this.noResize ? 'none' : null,
        // The computed height for auto resize
        height: this.computedHeight,
      };
    },
    computedMinRows() {
      // Ensure rows is at least 2 and positive (2 is the native textarea value)
      return Math.max(parseInt(this.rows, 10) || 2, 2);
    },
    computedMaxRows() {
      return Math.max(this.computedMinRows, parseInt(this.maxRows, 10) || 0);
    },
    computedRows() {
      return this.computedMinRows === this.computedMaxRows ? this.computedMinRows : null;
    },
    computedHeight() {
      const el = this.$el;

      if (this.isServer) return null;

      // We compare this.trueValue to null to ensure reactivity of content changes.
      if (this.trueValue === null || this.computedRows || this.doNotResize || this.$isServer) {
        return null;
      }

      // Element must be visible (not hidden) and in document. *Must* be checked after above.
      // if (!isVisible(el)) return null;

      // Remember old height and reset it temporarily
      const oldHeight = el.style.height;
      el.style.height = 'auto';

      // Get current computed styles
      const computedStyle = window.getComputedStyle(el);

      // Height of one line of text in px
      const lineHeight = parseFloat(computedStyle.lineHeight);

      // Minimum height for min rows (browser dependant)
      const minHeight = parseInt(computedStyle.height, 10) || lineHeight * this.computedMinRows;

      // Calculate height of content
      const offset =
        (parseFloat(computedStyle.borderTopWidth) || 0) +
        (parseFloat(computedStyle.borderBottomWidth) || 0) +
        (parseFloat(computedStyle.paddingTop) || 0) +
        (parseFloat(computedStyle.paddingBottom) || 0);

      // Calculate content height in "rows"
      const contentRows = (el.scrollHeight - offset) / lineHeight;

      // Put the old height back (needed when new height is equal to old height!)
      el.style.height = oldHeight;

      // Calculate number of rows to display (limited within min/max rows)
      const rows = Math.min(Math.max(contentRows, this.computedMinRows), this.computedMaxRows);

      // Calulate the required height of the textarea including border and padding (in pixels)
      const height = Math.max(Math.ceil(rows * lineHeight + offset), minHeight);

      // return the new computed height in px units
      return `${height}px`;
    },
  },

  mounted() {
    // Enable opt-in resizing once mounted.
    this.$nextTick(() => {
      this.doNotResize = false;
    });
  },

  activated() {
    // If being re-activated in <keep-alive>, enable opt-in resizing.
    this.$nextTick(() => {
      this.doNotResize = false;
    });
  },

  deactivated() {
    // If in a deactivated <keep-alive>, disable opt-in resizing.
    this.doNotResize = true;
  },

  beforeDestroy() {
    this.doNotResize = true;
  },
};
</script>
