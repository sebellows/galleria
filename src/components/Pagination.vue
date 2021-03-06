<template>
  <nav class="mico-pagination" :aria-label="ariaLabel">
    <ol v-show="pages.length > 0" class="pagination mb-0">
      <li class="first" :class="{ disabled: currentPage === 1 }">
        <a
          class="page-link"
          href="#"
          :aria-disabled="currentPage === 1"
          :tabindex="currentPage === 1 ? -1 : null"
          @click="getPage($event, (currentPage -= 1))"
        >
          <span class="sr-only">First page</span>
          «
        </a>
      </li>
      <li class="prev" :class="{ disabled: currentPage === 1 }">
        <a
          class="page-link"
          href="#"
          :aria-disabled="currentPage === 1"
          :tabindex="currentPage === 1 ? -1 : null"
          @click="getPage($event, (currentPage -= 1))"
        >
          <span class="sr-only">Previous page</span>
          ‹
        </a>
      </li>
      <li v-for="page in pages" :key="page" class="page-item">
        <a
          class="page-link"
          :class="{ disabled: currentPage === page }"
          href="#"
          :aria-disabled="currentPage === page"
          :tabindex="currentPage === page ? -1 : null"
          @click="getPage($event, page)"
        >
          {{ page }}
          <span v-if="currentPage === page" class="sr-only">(current)</span>
        </a>
      </li>
      <li class="next" :class="{ disabled: pages.length === 1 || currentPage === pages.length }">
        <a
          class="page-link"
          href="#"
          :aria-disabled="currentPage === pages.length"
          :tabindex="currentPage === pages.length ? -1 : null"
          @click="getPage($event, (currentPage += 1))"
        >
          <span class="sr-only">Next page</span>
          ›
        </a>
      </li>
      <li class="last" :class="{ disabled: pages.length === 1 || currentPage === pages.length }">
        <a
          class="page-link"
          href="#"
          :aria-disabled="currentPage === pages.length"
          :tabindex="currentPage === pages.length ? -1 : null"
          @click="getPage($event, (currentPage += 1))"
        >
          <span class="sr-only">Last page</span>
          »
        </a>
      </li>
    </ol>
  </nav>
</template>

<script>
import { isVisible, range } from '@/shared/utils';

function sanitizePerPage(value) {
  const perPage = parseInt(value, 10);
  return perPage < 1 ? 1 : perPage;
}

function sanitizeTotalItems(value) {
  const totalItems = parseInt(value, 10);
  return totalItems < 0 ? 0 : totalItems;
}

export default {
  name: 'mico-pagination',

  props: {
    activePage: {
      type: Number,
      default: 1,
    },
    ariaLabel: {
      type: String,
      default: 'pagination',
    },
    limit: {
      type: Number,
      default: 5,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 10,
    },
  },

  data() {
    return {
      currentPage: this.activePage,
      pages: [],
      pagePool: [],
    };
  },

  watch: {
    totalItems(newVal, oldVal) {
      if (oldVal != null && newVal !== oldVal) {
        this.updatePages();
      }
    },
  },

  mounted() {
    this.updatePages();
  },

  methods: {
    updatePages() {
      const result = Math.ceil(sanitizeTotalItems(this.totalItems) / sanitizePerPage(this.perPage));
      this.pagePool = result < 1 ? [1] : range(1, result);

      if (this.pagePool.length > 0) {
        if (this.pagePool.length > this.limit) {
          const currentPage = this.currentPage > 0 ? this.currentPage - 1 : 0;
          this.pages = this.pagePool.slice(currentPage, this.limit);
        } else {
          this.pages = this.pagePool.concat();
        }
      }
    },
    getPage($event, index) {
      $event.preventDefault();

      const firstPage = this.pagePool[0];
      const firstPaginatedPage = this.pages[0];
      const lastPage = this.pagePool[this.pagePool.length - 1];
      const lastPaginatedPage = this.pages[this.pages.length - 1];

      if (index > lastPaginatedPage && index !== lastPage) {
        this.pages = this.pagePool.slice(firstPaginatedPage, index);
      }
      if (index < firstPaginatedPage && index > firstPage) {
        this.pages = this.pagePool.slice(index, lastPage - 1);
      }

      this.currentPage = index;

      this.$emit('updated', $event, this.currentPage);

      this.$nextTick(() => {
        const target = $event.target;
        if (isVisible(target) && this.$el.contains(target) && target.focus) {
          target.focus();
        } else {
          this.focusCurrent();
        }
      });
    },
  },
};
</script>

<style>
.mico-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  overflow: hidden;
  margin: 0 auto var(--spacer-5);
  padding: 0;
}
.mico-pagination > ol {
  max-width: min-content;
  margin-left: auto;
  margin-right: auto;
  padding-left: 0;
  list-style: none;
  display: flex;
  align-items: stretch;
  justify-content: center;
}
.mico-pagination li {
  display: inline-block;
}
.mico-pagination a {
  padding: 1em;
  display: block;
  color: var(--dark);
  text-decoration: none;
  font-weight: 700;
}
.mico-pagination a[aria-disabled] {
  color: var(--gray);
  pointer-events: none;
  outline: none;
  box-shadow: none;
}
.mico-pagination li.selected a {
  background: var(--light);
}
</style>
