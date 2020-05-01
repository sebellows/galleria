<template>
  <input
    :id="id"
    ref="input"
    :autofocus="autofocus"
    :autocomplete="shouldAutocomplete"
    :class="computedClasses"
    :disabled="isDisabled"
    :minlength="min"
    :maxlength="max"
    :name="name"
    :pattern="pattern"
    :placeholder="placeholder"
    :readonly="readonly"
    :required="required"
    :type="type"
    :value="trueValue"
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
import { MICO_INPUT_TYPES } from '@/shared/const';
import { propertyValidator } from '@/shared/utils';
import TextFieldBase from './_TextFieldBase';

export default {
  name: 'mico-input',

  extends: TextFieldBase,

  props: {
    max: {
      type: [String, Number],
      default: null,
    },
    min: {
      type: [String, Number],
      default: null,
    },
    pattern: {
      type: String,
    },
    step: {
      type: [String, Number],
      default: null,
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => propertyValidator(value, MICO_INPUT_TYPES),
    },
  },
};
</script>
