<template>
  <mico-input-group class="mico-search-field">
    <mico-input :id="id" type="search" :name="id" :placeholder="placeholder" v-model="query" />
    <span v-if="useIcon" slot="append" class="input-group-text">
      <mico-icon name="search" size="16" />
    </span>
  </mico-input-group>
</template>

<script>
import { clone, getDeepValue, isBoolean, isDefined, isFunction } from '@/shared/utils';

export default {
  name: 'mico-search-field',

  props: {
    filter: {
      type: Function,
      default: null,
    },
    // Property/properties to filter results by
    queryParams: {
      type: [String, Array],
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
    // Default number of characters in query before updating results
    min: {
      type: Number,
      default: 3,
    },
    // The record items to query search
    items: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: 'Search…',
    },
    useIcon: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      query: '',
      // Used to store the original items array prior to filter so
      // we can reset them to their original state when we need to.
      storedItems: null,
    };
  },

  watch: {
    query: 'updateResults',
  },

  methods: {
    updateResults(newVal, oldVal) {
      if (!this.storedItems) {
        this.storedItems = clone(this.items);
      }
      if (newVal !== oldVal) {
        if (newVal.length >= this.min) {
          const results =
            this.filter && isFunction(this.filter)
              ? this.filter(this.items, this.query, this.queryParams)
              : this.filterItems();

          this.$emit('search', results);
        }
      }
      if (oldVal && newVal === '') {
        this.$emit('search', this.storedItems);
      }
    },
    filterItems() {
      const filters = this.queryParams?.length ? this.queryParams : Object.keys(this.items[0]);

      if (Array.isArray(filters)) {
        return this.items.filter((item) =>
          filters.some((prop) =>
            this.queryFilter(getDeepValue(item, prop, item[prop]), this.query),
          ),
        );
      } else {
        return this.items.filter((item) =>
          this.queryFilter(getDeepValue(item, filters, item[filters]), this.query),
        );
      }
    },
    queryFilter(value, query) {
      return (
        isDefined(value) &&
        !isBoolean(value) &&
        value
          .toString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
      );
    },
  },
};
</script>
