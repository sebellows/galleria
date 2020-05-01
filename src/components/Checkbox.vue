<script>
import ToggleBase from './_ToggleBase';

export default {
  name: 'mico-checkbox',

  extends: ToggleBase,

  inject: {
    toggleGroup: {
      from: 'micoCheckboxGroup',
      default: function() {
        return this;
      },
    },
  },

  props: {
    indeterminate: {
      type: Boolean,
      default: false,
    },
    // Custom switch styling
    switch: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isChecked() {
      const checked = this.computedLocalChecked;
      const value = this.value;

      if (Array.isArray(checked)) {
        return checked.includes(value);
      } else {
        return checked == value;
      }
    },
    type() {
      return 'checkbox';
    },
  },

  watch: {
    computedLocalChecked(newVal) {
      this.$emit('input', newVal);

      if (this.$refs && this.$refs.input) {
        this.$emit('update:indeterminate', this.$refs.input.indeterminate);
      }
    },
    indeterminate(newVal) {
      this.setIndeterminate(newVal);
    },
  },

  mounted() {
    // Set initial indeterminate state
    this.setIndeterminate(this.indeterminate);
  },

  methods: {
    handleChange({ target: { checked, indeterminate } }) {
      let localChecked = this.computedLocalChecked;
      const value = this.value;
      let uncheckedValue = null;

      // Update computedLocalChecked
      if (Array.isArray(localChecked)) {
        const idx = localChecked.indexOf(value);

        if (checked && idx < 0) {
          // add value to array
          localChecked = localChecked.concat(value);
        } else if (!checked && idx > -1) {
          // remove value from array
          localChecked = localChecked.slice(0, idx).concat(localChecked.slice(idx + 1));
        }
      } else {
        uncheckedValue = this.uncheckedValue;
        localChecked = checked ? value : uncheckedValue;
      }
      this.computedLocalChecked = localChecked;

      // Change is only emitted on user interaction
      this.$emit('change', checked ? value : uncheckedValue);

      // If this is a child of form-checkbox-group, we emit a change event on it as well
      if (this.isGroup) {
        this.toggleGroup.$emit('change', localChecked);
      }

      this.$emit('update:indeterminate', indeterminate);
    },
    setIndeterminate(state) {
      // Indeterminate only supported in single checkbox mode
      if (Array.isArray(this.computedLocalChecked)) {
        state = false;
      }
      if (this.$refs && this.$refs.input) {
        this.$refs.input.indeterminate = state;
        // Emit update event to prop
        this.$emit('update:indeterminate', state);
      }
    },
  },
};
</script>
