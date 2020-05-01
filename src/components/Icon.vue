<template>
  <component :is="tag" class="mico-icon" :class="classes" aria-hidden="true" focusable="false">
    <svg class="mico-icon-svg">
      <use :xlink:href="`#${name}`" />
    </svg>
  </component>
</template>

<script>
import { variantable } from '@/shared/mixins';
import { MICO_COMPONENT_SIZES, MICO_INLINE_SIZES } from '@/shared/const';
import { appendSuffixToClassName, isNumber, propertyValidator } from '@/shared/utils';

const ICON_SIZES = [...MICO_COMPONENT_SIZES, ...MICO_INLINE_SIZES];

export default {
  name: 'mico-icon',

  mixins: [variantable],

  props: {
    animation: String,
    inline: Boolean,
    name: String,
    size: {
      type: String,
      default: null,
      validator: (value) => isNumber(Number(value)) || propertyValidator(value, ICON_SIZES),
    },
    tag: {
      type: String,
      default: 'span',
    },
  },

  computed: {
    classes() {
      const sizeClass = MICO_COMPONENT_SIZES.includes(this.size) ? 'mico-icon' : 'size';
      const compSizeClass = this.size != null ? appendSuffixToClassName(sizeClass, this.size) : '';
      const animationClass = typeof this.animation === 'string' ? this.animation : '';

      return [
        {
          'mico-icon-inline': this.inline,
        },
        animationClass,
        this.setVariantClass('text', this.variant),
        compSizeClass,
      ];
    },
  },
};
</script>

<style>
.mico-icon {
  display: inline-block;
  line-height: 1;
  width: 1.5rem;
  height: 1.5rem;
}
.mico-icon .mico-icon-sm {
  font-size: 1rem;
  width: 1rem;
  height: 1rem;
}
.mico-icon .mico-icon-lg {
  font-size: 2rem;
  width: 2rem;
  height: 2rem;
}
.mico-icon .mico-icon-inline {
  position: relative;
  top: -0.15625rem;
  vertical-align: middle;
}

.mico-icon .mico-icon-svg {
  fill: currentColor;
  display: block;
  max-width: 100%;
  height: 100%;
}
</style>
