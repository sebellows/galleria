<template>
  <transition name="mico-spinner" appear>
    <div class="mico-spinner" :style="styles">
      <div className="spinner-container">
        <div className="spinner-layer">
          <div className="spinner-circle-mask left">
            <div className="spinner-circle" />
          </div>
          <div className="spinner-circle-gap">
            <div className="spinner-circle" />
          </div>
          <div className="spinner-circle-mask right">
            <div className="spinner-circle" />
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

<style lang="postcss">
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
  transition: opacity, transform $swift-ease-in-out-duration $swift-ease-in-out-timing-function;
}
.spinner-container {
  width: 100%;
  height: 100%;
  border-color: inherit;
  /* duration: 360 * ARCTIME / (ARCSTARTROT + (360-ARCSIZE)) */
  animation: container-rotate 1568ms linear infinite;
}
.spinner-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 1;
  border-color: inherit;
  white-space: nowrap;
  font-size: 0px;
  /* durations: 4 * ARCTIME */
  animation: fill-unfill-rotate 5332ms var(--fast-out-slow-in-timing) infinite both;
}
.spinner-circle {
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
.spinner-circle-gap {
  position: absolute;
  top: 0;
  left: 45%;
  width: 10%;
  height: 100%;
  overflow: hidden;
  border-color: inherit;
}
.spinner-circle-gap .spinner-circle {
  width: 1000%;
  left: -450%;
}
.spinner-circle-mask {
  display: inline-block;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
  border-color: inherit;
}
.spinner-circle-mask .spinner-circle {
  width: 200%;
}
.spinner-circle-mask.left .spinner-circle {
  border-right-color: transparent !important;
  transform: rotate(129deg);
  animation: left-spin 1333ms var(--fast-out-slow-in-timing) infinite both;
}
.spinner-circle-mask.right .spinner-circle {
  left: -100%;
  border-left-color: transparent !important;
  transform: rotate(-129deg);
  animation: right-spin 1333ms var(--fast-out-slow-in-timing) infinite both;
}
.mico-spinner.spinner-out {
  /* duration: SHRINK_TIME */
  animation: fade-out 400ms var(--fast-out-slow-in-timing) both;
}
</style>
