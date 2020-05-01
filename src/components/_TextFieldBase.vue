<script>
import { validatable } from '@/shared/mixins';
import FieldBase from './_FieldBase';

export default {
  extends: FieldBase,

  mixins: [validatable],

  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    autocomplete: {
      type: String,
      default: 'on',
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    describedBy: {
      type: String,
    },
    formatter: {
      type: Function,
      default: null,
    },
    lazyFormatter: {
      type: Boolean,
      value: false,
    },
    noValidate: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
    plaintext: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
    },
    trim: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      trueValue: this.stringifyValue(this.value),
    };
  },

  computed: {
    computedClasses() {
      return [
        {
          'form-control': (!this.plaintext && this.type !== 'range') || this.type === 'color',
          [this.setComponentSizeClass('form-control', this.size)]: this.size,
          'form-control-plaintext':
            this.plaintext && this.type !== 'range' && this.type !== 'color',
          // Range input needs class custom-range
          'custom-range': this.type === 'range',
          'is-dirty': this.dirty,
          'is-touched': this.touched,
          'is-valid': this.dirty && this.isValid && this.noValidate === false,
          'is-invalid': this.dirty && this.isValid === false && this.noValidate === false,
        },
      ];
    },
    shouldAutocomplete() {
      return this.autocomplete === 'on' ? 'on' : this.autocomplete;
    },
    selectionStart: {
      // Expose selectionStart for formatters, etc
      cache: false,
      get() {
        return this.$refs.input.selectionStart;
      },
      set(val) {
        this.$refs.input.selectionStart = val;
      },
    },
    selectionEnd: {
      // Expose selectionEnd for formatters, etc
      cache: false,
      get() {
        return this.$refs.input.selectionEnd;
      },
      set(val) {
        this.$refs.input.selectionEnd = val;
      },
    },
    selectionDirection: {
      // Expose selectionDirection for formatters, etc
      cache: false,
      get() {
        return this.$refs.input.selectionDirection;
      },
      set(val) {
        this.$refs.input.selectionDirection = val;
      },
    },
    validity: {
      // Expose validity property
      cache: false,
      get() {
        return this.$refs.input.validity;
      },
    },
    validationMessage: {
      // Expose validationMessage property
      cache: false,
      get() {
        return this.$refs.input.validationMessage;
      },
    },
    willValidate: {
      // Expose willValidate property
      cache: false,
      get() {
        return this.$refs.input.willValidate;
      },
    },
  },

  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue && newValue !== this.trueValue) {
        this.trueValue = this.stringifyValue(newValue);
      }
    },
  },

  mounted() {
    this.setValue(this.value);
  },

  methods: {
    stringifyValue(value) {
      return value === null || typeof value === 'undefined' ? '' : String(value);
    },
    setValue(value) {
      value = this.stringifyValue(value);

      if (this.trueValue !== value) {
        this.trueValue = value;

        if (this.$refs.input.value !== value) {
          this.$refs.input.value = value;
        }

        if (this.type === 'number') {
          value = Number(value);
        } else if (this.trim) {
          // Emulate .trim modifier behaviour
          value = value.trim();
        }

        // Update the v-model
        this.$emit('update', value);
      }
    },
    getFormatted(value, evt, force = false) {
      value = this.stringifyValue(value);

      if ((!this.lazyFormatter || force) && typeof this.formatter === 'function') {
        value = this.formatter(value, evt);
      }

      return value;
    },
    setSelectionRange() {
      // For external handler that may want a setSelectionRange(a,b,c) method
      this.$refs.input.setSelectionRange(...arguments);
    },
    setRangeText() {
      // For external handler that may want a setRangeText(a,b,c) method
      this.$refs.input.setRangeText(...arguments);
    },
    setCustomValidity() {
      // For external handler that may want a setCustomValidity(...) method
      return this.$refs.input.setCustomValidity(...arguments);
    },
    checkValidity() {
      // For external handler that may want a checkValidity(...) method
      return this.$refs.input.checkValidity(...arguments);
    },
    reportValidity() {
      // For external handler that may want a reportValidity(...) method
      return this.$refs.input.reportValidity(...arguments);
    },
    onBlur(evt) {
      this.touched = true;
      this.untouched = false;

      // lazy formatter
      if (this.lazyFormatter) {
        const formatted = this.getFormatted(evt.target.value, evt, true);

        if (formatted === false || evt.defaultPrevented) return;

        this.setValue(formatted);
      }

      this.isValid = !this.noValidate ? this.$refs.input.validity.valid : void 0;

      // Emit native blur event
      this.$emit('blur', evt);
    },
    onChange(evt) {
      // evt.target.composing is set by Vue
      // https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/directives/model.js
      if (evt.target.composing || this.readonly) return;

      const { value } = evt.target;
      const formatted = this.getFormatted(value, evt);

      if (formatted === false || evt.defaultPrevented) return;

      this.setValue(formatted);
      this.$emit('change', formatted, evt);
    },
    onFocus(evt) {
      this.touched = false;
      this.untouched = true;

      if (this.readonly) evt.target.select();

      this.$emit('focus', evt);
    },
    onInput(evt) {
      // evt.target.composing is set by Vue
      // https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/directives/model.js
      if (evt.target.composing || this.readonly) return;

      if (this.pristine === true) {
        this.dirty = true;
        this.pristine = false;
      }

      const { value } = evt.target;

      const formatted = this.getFormatted(value, evt);

      if (formatted === false || evt.defaultPrevented) return;

      this.setValue(formatted);

      this.isValid = !this.noValidate ? this.$refs.input.validity.valid : void 0;

      this.$emit('input', formatted, evt);
    },
    onKeyUp(evt) {
      this.$emit('keyup', evt);
    },
    onKeyDown(evt) {
      this.$emit('keydown', evt);
    },
    onKeyPress(evt) {
      this.$emit('keypress', evt);
    },
    onPaste(evt) {
      this.$emit('paste', evt);
    },
    // For external handler that may want a focus method
    focus() {
      if (!this.disabled) this.$el.focus();
    },
    // For external handler that may want a blur method
    blur() {
      if (!this.disabled) this.$el.blur();
    },
    select() {
      // For external handler that may want a select() method
      this.$refs.input.select(...arguments);
    },
  },
};
</script>
