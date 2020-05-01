<template>
  <transition name="mico-spinner" appear>
    <div class="mico-spinner">
      <div class="mico-spinner-container">
        <div class="mico-spinner-layer">
          <div class="mico-spinner-circle-mask left">
            <div class="mico-spinner-circle" />
          </div>
          <div class="mico-spinner-circle-gap">
            <div class="mico-spinner-circle" />
          </div>
          <div class="mico-spinner-circle-mask right">
            <div class="mico-spinner-circle" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'mico-spinner',

  props: {
    // Resize the spinner.
    size: {
      type: Number,
      default: 50,
    },
  },

  computed: {
    styles() {
      const pxSize = `${this.size}px`;

      return {
        width: pxSize,
        height: pxSize,
      };
    },
  },
};
</script>

<style>
/** Animation */

/* Dropdown transitions */
@keyframes show {
  0% {
    transform: scaleY(0.1);
  }
  40% {
    transform: scaleY(1.04);
  }
  60% {
    transform: scaleY(0.98);
  }
  80% {
    transform: scaleY(1.02);
  }
  100% {
    transform: scaleY(1);
  }
}
@keyframes hide {
  0% {
    transform: scaleY(1);
  }
  60% {
    transform: scaleY(0.98);
  }
  80% {
    transform: scaleY(1.02);
  }
  100% {
    transform: scaleY(0);
  }
}
@keyframes container-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes fill-unfill-rotate {
  12.5% {
    transform: rotate(135deg);
  } /* 0.5 * ARCSIZE */
  25% {
    transform: rotate(270deg);
  } /* 1   * ARCSIZE */
  37.5% {
    transform: rotate(405deg);
  } /* 1.5 * ARCSIZE */
  50% {
    transform: rotate(540deg);
  } /* 2   * ARCSIZE */
  62.5% {
    transform: rotate(675deg);
  } /* 2.5 * ARCSIZE */
  75% {
    transform: rotate(810deg);
  } /* 3   * ARCSIZE */
  87.5% {
    transform: rotate(945deg);
  } /* 3.5 * ARCSIZE */
  to {
    transform: rotate(1080deg);
  } /* 4   * ARCSIZE */
}
@keyframes left-spin {
  from {
    transform: rotate(130deg);
  }
  50% {
    transform: rotate(-5deg);
  }
  to {
    transform: rotate(130deg);
  }
}
@keyframes right-spin {
  from {
    transform: rotate(-130deg);
  }
  50% {
    transform: rotate(5deg);
  }
  to {
    transform: rotate(-130deg);
  }
}

.mico-spinner {
  display: inline-flex;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-color: var(--primary);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  will-change: transform, opacity;
  z-index: 1000;
}
.mico-spinner-enter,
.mico-spinner-leave-to {
  opacity: 0;
  transform: scale(0.8) translateZ(0);
}
.mico-spinner-enter-to,
.mico-spinner-leave {
  opacity: 1;
  transform: scale(1) translateZ(0);
}
.mico-spinner-enter-active,
.mico-spinner-leave-active {
  transition: opacity, transform var(--ease-in-out-duration) var(--ease-in-out-timing-function);
}
.mico-spinner-container {
  width: 100%;
  height: 100%;
  border-color: inherit;
  animation: container-rotate 1568ms linear infinite;
}
.mico-spinner-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 1;
  border-color: inherit;
  white-space: nowrap;
  font-size: 0px;
  animation: fill-unfill-rotate 5332ms var(--fast-out-slow-in-timing) infinite both;
}
.mico-spinner-circle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  height: 100%;
  border-width: 3px;
  border-style: solid;
  border-color: inherit;
  border-bottom-color: transparent !important;
  border-radius: 50%;
}
.mico-spinner-circle-gap {
  position: absolute;
  top: 0;
  left: 45%;
  width: 0; /* was 10% */
  height: 100%;
  overflow: hidden;
  border-color: inherit;
}
.mico-spinner-circle-gap .spinner-circle {
  width: 1000%;
  left: -450%;
}
.mico-spinner-circle-mask {
  display: inline-block;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
  border-color: inherit;
}
.mico-spinner-circle-mask .mico-spinner-circle {
  width: 200%;
}
.mico-spinner-circle-mask.left .mico-spinner-circle {
  border-right-color: transparent !important;
  transform: rotate(129deg);
  animation: left-spin 1333ms var(--fast-out-slow-in-timing) infinite both;
}
.mico-spinner-circle-mask.right .mico-spinner-circle {
  left: -100%;
  border-left-color: transparent !important;
  transform: rotate(-129deg);
  animation: right-spin 1333ms var(--fast-out-slow-in-timing) infinite both;
}
.mico-spinner.mico-spinner-out {
  animation: fade-out 400ms var(--fast-out-slow-in-timing) both;
}
</style>
