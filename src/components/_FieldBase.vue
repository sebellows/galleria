<script>
import { idable, sizable, validatable } from '@/shared/mixins';

export default {
  name: 'mico-field-base',

  mixins: [idable, sizable, validatable],

  props: {
    ariaInvalid: {
      type: [Boolean, String],
      default: false,
    },
    ariaRequired: {
      type: [Boolean, String],
      default: false,
    },
    custom: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    form: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: void 0,
    },
    name: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      // Form field state flags
      pristine: true, // has not been interacted with
      dirty: false, // has been interacted with
      touched: false, // has been blurred
      untouched: true, // has not been blurred
      isValid: void 0,
    };
  },

  computed: {
    isDisabled() {
      return Boolean(this.disabled || this.readonly);
    },
    computedAriaInvalid() {
      if (this.isValid || this.ariaInvalid === true || this.ariaInvalid === 'true') {
        return 'true';
      }
      return null;
    },
  },

  methods: {
    onInput(evt) {
      if (this.pristine === true) {
        this.dirty = true;
        this.pristine = false;
      }
      this.$emit('input', evt.target.value, evt);
    },
    onChange(evt) {
      this.$emit('change', evt.target.value, evt);
    },
    onBlur(evt) {
      this.touched = true;
      this.untouched = false;

      this.$emit('blur', evt);
    },
    onFocus(evt) {
      this.touched = false;
      this.untouched = true;

      this.$emit('focus', evt);
    },
    onReset(evt) {
      this.$emit('reset', evt);
    },
  },
};
</script>
