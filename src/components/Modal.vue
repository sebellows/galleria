<template>
  <transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div
      v-show="isOpen"
      ref="modal"
      role="dialog"
      class="modal"
      :class="modalClasses"
      :aria-hidden="isOpen ? null : 'true'"
      @keydown="onEscape"
    >
      <div class="modal-overlay" aria-hidden="true"></div>
      <div
        ref="content"
        v-click-outside="close"
        class="modal-dialog"
        role="document"
        aria-labelledby="title"
        aria-describedby="content"
      >
        <div class="modal-dialog-content">
          <div class="modal-dialog-header">
            <h2 id="title">
              <slot name="modal-title" />
            </h2>
            <button
              type="button"
              ref="close"
              class="close"
              @click.prevent="close"
              aria-label="close"
            >&times;</button>
            <!-- <mico-close ref="close" :disabled="isTransitioning" @click="close" /> -->
          </div>
          <div id="content" class="modal-dialog-body">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// import MicoClose from './Close';
import { clickOutside } from '@/shared/directives/clickOutside';
import { ESCAPE } from '@/shared/utils';

export default {
  name: 'mico-modal',

  directives: { clickOutside },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      prevFocusedEl: null,
      isBlock: false, // Change the display value of the modal?
      isTransitioning: false, // Used for style control
      isOpening: false, // Semapbore for preventing incorrect modal open counts
      isOpen: false, // controls modal visible state
      isClosing: false, // Semapbore for preventing incorrect modal open counts
      isHidden: false,
    };
  },

  computed: {
    modalClasses() {
      return [
        {
          open: this.isOpen,
          'd-block': this.isBlock,
        },
      ];
    },
  },

  watch: {
    open(newVal, oldVal) {
      if (newVal !== oldVal) {
        this[newVal ? 'show' : 'close']();
      }
    },
  },

  mounted() {
    // Listen for outside calls to either open or close the modal
    this.$root.$on('mico-modal:show', this.show);
    this.$root.$on('mico-modal:close', this.close);

    // Initially show modal?
    if (this.open) this.show();
  },

  beforeDestroy() {
    if (this.isOpen) {
      this.isOpen = false;
      this.isTransitioning = false;

      // Re-adjust body/navbar/fixed padding/margins (as we were the last modal open)
      document.body.classList.remove('modal-open');
    }
  },

  methods: {
    show() {
      if (this.isOpen || this.isOpening) {
        // If already open, or in the process of opening, do nothing
        return;
      }
      if (this.isClosing) {
        // If in the process of closing, wait until hidden before re-opening
        this.$once('hidden', this.show);
        return;
      }

      this.prevFocusedEl = document.activeElement;

      this.isOpening = true;
      this.isHidden = false;

      this.$nextTick(() => {
        // Use `$nextTick()` to ensure the modal is in DOM first
        this.isOpen = true;
        this.isOpening = false;
        this.$emit('show');
      });
    },

    close() {
      if (!this.isOpen || this.isClosing) {
        return;
      }
      this.isClosing = true;

      this.$emit('close');

      if (!this.isOpen) {
        this.isClosing = false;
        return;
      }

      // Trigger the close transition
      this.isOpen = false;
    },

    // Transition Handlers
    onBeforeEnter() {
      this.isTransitioning = true;

      document.body.classList.add('modal-open');
    },

    onEnter() {
      this.isBlock = true;
    },

    onAfterEnter() {
      this.isOpen = true;
      this.isTransitioning = false;

      [window.requestAnimationFrame, window.webkitRequestAnimationFrame].forEach((raf) => {
        raf(() => {
          this.$emit('shown');
          this.$nextTick(() => {
            this.focusFirst();
          });
        });
      });
    },

    onBeforeLeave() {
      this.isTransitioning = true;
    },

    onLeave() {
      // Remove the 'open' class
      this.isOpen = false;
    },

    onAfterLeave() {
      this.isBlock = false;
      this.isTransitioning = false;

      document.body.classList.remove('modal-open');

      this.$nextTick(() => {
        this.isHidden = false;

        // Return focus to previous element prior to modal open
        this.prevFocusedEl?.focus();

        this.isClosing = false;
        this.$emit('hidden');
      });
    },

    onEscape(evt) {
      // If ESCAPE pressed, close modal
      if (evt.keyCode === ESCAPE && this.isOpen) {
        this.close();
      }
    },

    focusHandler(evt) {
      // If focus leaves modal, bring it back
      if (
        this.isOpen &&
        this.$refs.modal &&
        document !== evt.target &&
        !this.$refs.modal?.contains(evt.target)
      ) {
        this.$refs.modal.focus({ preventScroll: true });
      }
    },

    // Focus control handlers
    focusFirst() {
      if (!this.$refs.modal.contains(document.activeElement)) {
        // Make sure top of modal is showing (if longer than the viewport)
        // and focus the modal content wrapper
        this.$nextTick(() => {
          this.$refs.modal.scrollTop = 0;
          this.$refs.close.focus();
        });
      }
    },
  },
};
</script>

<style>
@-webkit-keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}
@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}
.modal:not(.open) {
  visibility: hidden;
}
.modal.open,
.modal-overlay {
  position: fixed;
  height: 100vh;
  width: calc(100vw - 15px);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.modal.open {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-overlay {
  background: rgba(255, 255, 255, 0.8);
  z-index: 1001;
}
.modal-dialog {
  position: relative;
  width: auto;
  max-width: 500px;
  margin: 1.75rem auto;
  box-shadow: var(--shadow-0), var(--shadow-1);
  z-index: 1002;
}
.modal-dialog-content {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  pointer-events: auto;
  background-color: var(--white);
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  outline: 0;
}
.modal-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-top-left-radius: 0.1875rem;
  border-top-right-radius: 0.1875rem;
}
.modal-dialog-header h2 {
  margin-top: 0;
  margin-bottom: 0;
}
.modal-dialog-header .close {
  margin: -1rem -1rem -1rem auto;
  padding: 1rem 1rem;
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--black);
  text-shadow: 0 1px 0 var(--white);
  background-color: transparent;
  border: 0;
  opacity: 0.5;
  -webkit-appearance: none;
  appearance: none;
}
.modal-dialog-header .close:hover {
  opacity: 0.75;
}
.modal-dialog-body {
  position: relative;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1rem;
}
</style>
