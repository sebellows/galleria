/**
 * SSR Safe Client Side ID attribute generation
 * id's can only be generated client side, after mount.
 * this._uid is not synched between server and client.
 */

export const idable = {
  props: {
    id: {
      type: String,
      default: null,
    },
    suffix: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      _localId: null,
    };
  },

  computed: {
    safeId() {
      // Computed property that returns a dynamic function for creating the ID.
      // Reacts to changes in both .id and ._localId And regens a new function
      let id = this.id !== null ? this.id : this._localId;

      // We return a function that accepts an optional suffix string
      // So this computed prop looks and works like a method!!!
      const fn = (suffix) => {
        if (!id) {
          // return null;
          id = this._uid;
        }

        suffix = String(suffix || '').replace(/\s+/g, '_');

        return suffix ? `${suffix}_${id}` : id;
      };
      return fn;
    },
  },

  mounted() {
    // mounted only occurs client side
    this.$nextTick(() => {
      // Update dom with auto ID after dom loaded to prevent SSR hydration errors.
      this._localId = `__ITHAKA_ID__${this.suffix}${this._uid}`;
    });
  },
};
