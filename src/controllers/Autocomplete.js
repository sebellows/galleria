import { compare, domQuery as $, DOWN, UP, ENTER, ESCAPE } from '@/shared/utils';
import { idable, optionable } from '@/shared/mixins';

export default {
  mixins: [idable, optionable],

  props: {
    focusClass: {
      type: String,
      default: 'is-focused',
    },
    inputClass: {
      type: String,
      default: 'autocomplete-input',
    },
    itemClass: {
      type: String,
      default: 'autocomplete-item',
    },
    items: {
      type: [Array, Function],
      default: null,
    },
    // Minimum number of characters to type before fetching results.
    min: {
      type: Number,
      default: 2,
    },
    name: {
      type: String,
      default: 'autocomplete',
    },
    itemKey: {
      type: String,
      default: null,
    },
    sortFn: {
      type: Function,
      default: null, // (x) => x
    },
    value: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      containerEl: null,
      queryValue: this.value || '',
      results: [],
      selectedIndex: void 0,
      // Status
      error: null,
      loading: false,
      resolved: null,
    };
  },

  watch: {
    value: 'updateQuery',
    queryValue: 'onQuery',
  },

  methods: {
    // The `queryValue` method will handle different queryValue types for us.
    async onQuery() {
      if (this.loading) return;

      this.loading = true;

      if (typeof this.items == 'function') {
        try {
          this.results = await this.items(this.queryValue);
          this.resolved = true;
          this.$emit('updated', this.results);
        } catch (error) {
          this.error = error;
          this.$emit('error', error);
        }
      } else if (Array.isArray(this.items)) {
        const regex = new RegExp(`${this.queryValue.toLowerCase()}`, 'gi');
        const matches = this.items.filter((item) => regex.test(item[this.itemKey].toLowerCase()));

        if (!this.sortFn) {
          this.results = compare(matches, this.itemKey);
        } else {
          this.results = this.sortFn(matches, this.itemKey);
        }
        this.$emit('updated', this.results);
      }

      this.loading = false;
    },

    resolveItem(item) {
      return this.itemKey && item[this.itemKey] ? item[this.itemKey] : item;
    },

    handleClick(evt) {
      if ($(evt.target).hasClass('active')) {
        evt.preventDefault();
      }

      this.handleSelect(evt);
    },

    updateQuery(value) {
      if (value.length >= this.min) {
        this.queryValue = value;
        this.$emit('input', value);
      } else {
        this.results = [];
      }
    },

    handleKeyDown(evt) {
      const { keyCode } = evt;
      const lastItem = this.results.length - 1;

      this.containerEl = this.$scopedSlots.default()[0];
      // const inputEl = this.containerEl.children[0];
      const menuEl = this.containerEl.children[1];
      const itemEls = $(menuEl).all(this.itemClass);

      // Disable when list isn't showing up
      if (!itemEls.length) return;

      // Key List
      switch (keyCode) {
        case DOWN:
          // if (evt.repeat) return;
          this.selectedIndex =
            typeof this.selectedIndex === 'undefined' || this.selectedIndex === lastItem
              ? 0
              : this.selectedIndex + 1;
          break;
        case UP:
          this.selectedIndex = this.selectedIndex === 0 ? lastItem : this.selectedIndex - 1;
          break;
        case ENTER:
          this.handleSelect(evt);
          this.handleBlur(evt);
          break;
        case ESCAPE:
          itemEls[this.selectedIndex].blur();
          this.selectedIndex = void 0;
          break;
        default:
        // do nothing
      }
      // this.$emit('keydown', evt.target.value);
    },

    handleSelect(evt) {
      /* eslint-disable prefer-const */
      let value = null;
      const el = evt.target.tagName !== 'INPUT' ? evt.target : $(this.focusClass, this.containerEl);

      for (const item of this.results) {
        if (item[this.itemKey] == el.textContent.trim()) {
          value = item[this.itemKey];
          break;
        }
      }

      // Update the input if there is a selected option.
      if (value) {
        this.queryValue = value;
      }

      // Emit the selected index via the Event Bus.
      this.$emit('selected', { value, el });
    },

    handleBlur(evt) {
      // Remove the focus from the input.
      const inputEl = this.containerEl.children[0];
      inputEl.blur();

      // Change the selectedIndex to undefined so we can start over if user wants to.
      this.selectedIndex = void 0;

      this.$emit('keydown', evt.target.value);
    },
  },

  render() {
    return this.$scopedSlots.default({
      // Data
      results: this.results,
      // Methods
      listeners: {
        // input: this.updateQuery,
        keydown: this.handleKeyDown,
        blur: this.handleBlur,
        click: this.handleClick,
      },
      status: {
        error: this.error,
        loading: this.pending,
        success: this.resolved,
      },
    });
  },
};
