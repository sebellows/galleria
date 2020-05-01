<script>
import { variantable } from '@/shared/mixins';
import FieldBase from './_FieldBase';

export default {
  name: 'mico-form-toggle',

  extends: FieldBase,

  mixins: [
    variantable, // Only applicable when rendered with button style
  ],

  model: {
    prop: 'checked',
    event: 'input',
  },

  props: {
    alignLabel: {
      type: String,
      default: 'right',
    },
    button: {
      // only aplicable in standalone mode (non-group)
      type: Boolean,
      default: false,
    },
    checked: {
      // v-model
      type: [String, Number, Object, Array, Boolean],
      default: null,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    labelClass: {
      type: [String, Array],
      default: null,
    },
    pretty: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Boolean, Number, String, Object],
      default: true,
    },
  },

  data() {
    return {
      // Surrogate value when not a child of group
      buttons: false,
      hasFocus: false,
      localChecked: this.toggleGroup.checked,
      trueValue: this.value,
    };
  },

  computed: {
    computedLocalChecked: {
      get() {
        return this.toggleGroup.localChecked;
      },
      set(val) {
        this.toggleGroup.localChecked = val;
      },
    },
    isBtnMode() {
      // Support button style in single input mode
      return this.isGroup ? this.toggleGroup.buttons : this.button;
    },
    isCustom() {
      return !this.isBtnMode ? false : !this.toggleGroup.custom;
    },
    isGroup() {
      // Is this check/radio a child of check-group or radio-group?
      return this.toggleGroup !== this;
    },
    isInline() {
      return this.toggleGroup.inline;
    },
    isPlain() {
      return !this.isBtnMode && !this.toggleGroup.custom && !this.toggleGroup.pretty;
    },
    isPretty() {
      return this.isBtnMode || this.isPlain ? false : this.toggleGroup.pretty;
    },
    isRequired() {
      // Required only works when a name is provided for the input(s)
      return Boolean(this.getName && this.toggleGroup.required);
    },
    isSwitch() {
      // Custom switch styling (checkboxes only)
      return this.isBtnMode || this.isRadio || this.isPlain
        ? false
        : this.isGroup
        ? this.toggleGroup.switches
        : this.switch;
    },
    getName() {
      // Group name preferred over local name
      return this.toggleGroup.groupName || this.name || null;
    },
    getForm() {
      return this.toggleGroup.form || null;
    },
    getSize() {
      return this.toggleGroup.size || '';
    },
    getState() {
      // local state preferred over group state (except when null)
      if (typeof this.computedState === 'boolean') {
        return this.computedState;
      } else if (typeof this.toggleGroup.computedState === 'boolean') {
        return this.toggleGroup.computedState;
      } else {
        return null;
      }
    },
    getButtonVariant() {
      // Local variant preferred over group variant
      return this.variant || this.toggleGroup.variant || 'secondary';
    },
    buttonClasses() {
      // Same for radio & check
      return [
        'btn',
        this.setVariantClass('btn', this.getButtonVariant),
        this.setComponentSizeClass('btn', this.getSize),
        // 'disabled' class makes "button" look disabled
        this.isDisabled ? 'disabled' : '',
        // 'active' class makes "button" look pressed
        this.isChecked ? 'active' : '',
        // Focus class makes button look focused
        this.hasFocus ? 'focus' : '',
      ];
    },
  },

  watch: {
    checked(newValue) {
      this.computedLocalChecked = newValue;
    },
    isDisabled() {
      // Child can be disabled while parent isn't, but is always disabled if group is
      return this.toggleGroup.disabled || this.disabled;
    },
  },

  methods: {
    // When in buttons mode, we need to add 'focus' class to label when input focused
    handleFocus($event) {
      if ($event.target) {
        if ($event.type === 'focus') {
          this.hasFocus = true;
        } else if ($event.type === 'blur') {
          this.hasFocus = false;
        }
      }
    },
  },

  render(h) {
    const defaultSlot = this.$slots.default;

    // Generate the input element
    const on = { change: this.handleChange };

    if (this.isBtnMode) {
      // handlers for focus styling when in button mode
      on.focus = on.blur = this.handleFocus;
    }

    const input = h('input', {
      ref: 'input',
      key: 'input',
      on,
      class: {
        'form-check-input': this.isPlain,
        'custom-control-input': this.isCustom,
        'pretty-control-input': this.isPretty,
        'is-valid': this.getState === true && !this.isBtnMode,
        'is-invalid': this.getState === false && !this.isBtnMode,
      },
      directives: [
        {
          name: 'model',
          rawName: 'v-model',
          value: this.computedLocalChecked,
          expression: 'computedLocalChecked',
        },
      ],
      attrs: {
        id: this.safeId(),
        type: this.type,
        name: this.getName,
        form: this.getForm,
        disabled: this.isDisabled,
        required: this.isRequired,
        checked: this.isChecked,
        autocomplete: 'off',
        'aria-required': this.isRequired || null,
      },
      domProps: {
        value: this.value,
        checked: this.isChecked,
      },
    });

    if (this.isBtnMode) {
      // Button mode
      let button = h('label', { class: this.buttonClasses }, [input, defaultSlot]);

      if (!this.isGroup) {
        // Standalone button mode, so wrap in 'btn-group-toggle'
        // and flag it as inline-block to mimic regular buttons
        button = h('div', { class: ['btn-group-toggle', 'd-inline-block'] }, [button]);
      }

      return button;
    } else {
      // Control-indicator for pretty controls.
      const indicator = h('span', { class: 'pretty-control-indicator' });

      const innerTag = this.isPretty ? 'span' : 'label';

      // Not button mode
      const label = h(
        innerTag,
        {
          class: [
            {
              'form-check-label': this.isPlain,
              'custom-control-label': this.isCustom,
              'pretty-control-label-text': this.isPretty,
            },
            this.labelClass,
          ],
          attrs: { for: this.safeId() },
        },
        defaultSlot,
      );

      const tag = this.isPretty ? 'label' : 'div';
      const children = this.isPretty
        ? [input, indicator, label]
        : this.alignLabel === 'left'
        ? [label, input]
        : [input, label];

      return h(
        tag,
        {
          class: {
            'form-check': this.isPlain,
            'align-label-left': this.isPlain && this.alignLabel === 'left',
            'form-check-inline': this.isPlain && this.isInline,
            'custom-control': this.isCustom,
            'custom-control-inline': this.isCustom && this.isInline,
            'custom-checkbox': this.isCustom && this.isCheck && !this.isSwitch,
            'custom-radio': this.isCustom && this.type === 'radio',
            'custom-switch': this.isSwitch,
            'pretty-form-control': this.isPretty,
            'pretty-radio': this.isPretty && this.type === 'radio',
            'pretty-checkbox': this.isPretty && this.type === 'checkbox',
            'd-block': this.isPretty && !this.inline,
            [`form-control-${this.getSize}`]: Boolean(this.getSize && !this.isBtnMode),
          },
        },
        children,
      );
    }
  },
};
</script>
