<template>
  <div id="app" class="container">
    <icon-sprite />
    <header class="text-center py-3">
      <h1>Image Gallery</h1>
      <form no-validate>
        <div class="mx-auto mb-3" style="max-width: 400px;">
          <label for="image-filter">Search</label>
          <div class="input-group mb-3">
            <mico-input
              v-model="query"
              class="autocomplete-input"
              type="search"
              placeholder="Search..."
              name="image-filter"
              :value="query"
              autocomplete="off"
              no-validate
            />
            <div class="input-group-append">
              <span class="input-group-text">
                <mico-icon name="search" />
              </span>
            </div>
          </div>
          <fieldset>
            <div class="d-flex align-items-center justify-content-center">
              <legend class="w-auto mx-1">Filter by:</legend>
              <div class="form-check mx-1">
                <label for="title-filter">Title</label>
                <input
                  type="radio"
                  name="image-filter"
                  id="title-filter"
                  v-model="filter"
                  value="title"
                  :checked="filter === 'title'"
                  class="form-check-input"
                />
              </div>
              <div class="form-check mx-1">
                <label for="description-filter">Description</label>
                <input
                  type="radio"
                  name="image-filter"
                  id="description-filter"
                  v-model="filter"
                  value="description"
                  :checked="filter === 'description'"
                  class="form-check-input"
                />
              </div>
              <div class="form-check mx-1">
                <label for="title-filter">Owner</label>
                <input
                  type="radio"
                  name="image-filter"
                  id="ownername-filter"
                  v-model="filter"
                  value="ownername"
                  :checked="filter === 'ownername'"
                  class="form-check-input"
                />
              </div>
            </div>
          </fieldset>
          <small>Displaying {{ imageCount }} of {{ totalImages }} images</small>
        </div>
        <p v-if="noResults" class="text-center text-danger">No matching images were found.</p>
      </form>
    </header>

    <gallery v-if="images.length">
      <mico-spinner v-show="isLoading" />
      <gallery-thumbnail
        v-for="image in images"
        :key="image.id"
        :id="image.id"
        href="#"
        :src="image.src"
        :height="image.height"
        :width="image.width"
        :caption="image.title"
        @click="editImage(image)"
      ></gallery-thumbnail>
    </gallery>

    <mico-pagination :totalItems="totalImages" :perPage="imageCount" @updated="updateGallery" />

    <mico-modal ref="modal" :open="openDialog" @close="cancelUpdate">
      <template slot="modal-title" v-if="selectedRecord">{{ selectedRecord.title }}</template>
      <image-form
        v-if="selectedImage"
        ref="image-form-dialog"
        :image="selectedImage"
        @cancel="cancelUpdate"
        @submit="updateImage"
      />
    </mico-modal>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import Gallery from '@/components/Gallery';
import GalleryThumbnail from '@/components/GalleryThumbnail';
import IconSprite from '@/views/partials/IconSprite';
import ImageForm from '@/containers/ImageFormContainer';
import MicoIcon from '@/components/Icon';
import MicoInput from '@/components/TextInput';
import MicoModal from '@/components/Modal';
import MicoPagination from '@/components/Pagination';
import MicoSpinner from '@/components/Spinner';

import { clone, isDefined, shallowCompare } from '@/shared/utils/common';

export function imageModelFactory(data = {}) {
  const {
    id = '',
    title = '',
    ispublic = false,
    description: descriptionContent = '',
    ownername = '',
    url_q_cdn: src = '',
    width_q: width = '',
    height_q: height = '',
    ...params
  } = data;

  const description = descriptionContent._content ?? '';
  const dimensionsRE = /^width/g;
  const dimensions = Object.entries(params)
    .filter(([k, v]) => dimensionsRE.test(k))
    .sort(([k, v], [k2, v2]) => v - v2)
    .map(([k, v]) => {
      const suffix = k.split('_')[1];
      const h = params[`height_${suffix}`];
      return `${v} × ${h}`;
    })
    .join(', ');

  return {
    id,
    title,
    ispublic,
    description,
    dimensions,
    ownername,
    src,
    width,
    height,
  };
}

export default {
  name: 'Home',

  components: {
    // Autocomplete,
    Gallery,
    GalleryThumbnail,
    IconSprite,
    ImageForm,
    MicoIcon,
    MicoInput,
    MicoModal,
    MicoPagination,
    MicoSpinner,
  },

  data() {
    return {
      // Gallery
      isLoading: false,
      // Search, Gallery, & Pagination
      imageCount: 8, // Number of images to display in gallery
      totalImages: 100, // Total number of images handled by API
      // Search
      query: '', // Sent to API to fetch matching records
      noResults: false, // Show a message if no filtered results are found
      filter: 'title', // 'title', 'ownername', or 'description'
      // Pagination
      pages: 1,
      currentPage: 1,
      // Gallery
      images: [], // The current page's displayed images from API
      selectedImage: null, // The image data being currently edited
      openDialog: false, // Has an image been clicked to have it's data edited
      selectedRecord: null, // Store a clone of image data currently being edited
    };
  },

  created() {
    this.fetchResults();
  },

  mounted() {
    this.$root.$on('close', this.cancelUpdate);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('page') && urlParams.get('page') !== `${this.currentPage}`) {
      this.$router.push({ name: 'Home', query: { page: this.currentPage } });
    }
  },

  watch: {
    currentPage: {
      handler(currentPage, prevPage) {
        if (currentPage !== prevPage) {
          this.fetchResults({ [this.filter]: this.query });
        }
      },
    },
    filter: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && this.query.length > 2) {
          this.fetchResults({ [this.filter]: this.query });
        }
      },
    },
    query: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          let params = {};
          if (newVal.length > 2) {
            this.fetchResults({ [this.filter]: newVal });
          } else if (oldVal?.length > 2 && newVal.length < oldVal.length) {
            this.fetchResults();
          }
        }
      },
    },
  },

  methods: {
    _toSearchParams(queries) {
      const searchParams = new URLSearchParams();
      searchParams.append('pageNumber', this.currentPage);

      if (queries && Object.keys(queries).length) {
        Object.entries(queries).forEach(([k, v]) => {
          if (k !== 'pageNumber') {
            searchParams.append(k, v);
          }
        });
      }

      return searchParams;
    },
    async fetchResults(queries) {
      const searchParams = this._toSearchParams(queries).toString();
      this.isLoading = true;

      return fetch(`/api/photos?${searchParams}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Unable to load images.');
          }
          return response.json();
        })
        .then(({ totalPhotos, pages, photos, message }) => {
          this.pages = pages;
          this.totalImages = totalPhotos;
          this.imageCount = photos?.length || 0;

          if (this.imageCount > 0) {
            this._setImages(photos);
          } else {
            this.images = [];
          }
          this.noResults = photos == null || photos.length === 0;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          throw new Error(`Unable to complete request: ${err}`);
        });
    },
    _setImages(data) {
      if (this.images.length) {
        this.images = [];
      }
      const images = data.map(imageModelFactory);
      images.forEach(async (image, i) => {
        const cachedImage = await this.$ls.get(`${image.id}`);
        if (isDefined(cachedImage) && cachedImage instanceof Promise === false) {
          this.images.push(cachedImage);
        } else {
          this.images.push(image);
        }
      });
    },
    editImage(image) {
      this.selectedImage = image;
      this.selectedRecord = clone(image);
      this.openDialog = true;
    },
    cancelUpdate() {
      if (this.selectedRecord) {
        this.selectedImage = clone(this.selectedRecord);
        this.selectedRecord = null;
      }
      if (this.openDialog) this.openDialog = false;
    },
    updateImage(image) {
      if (this.selectedRecord) {
        if (!shallowCompare(this.selectedRecord, this.selectedImage)) {
          this.$ls.set(this.selectedImage.id, this.selectedImage);
        }
        this.selectedRecord = null;
      }
      this.openDialog = false;
    },
    updateGallery($event, page) {
      if (page <= this.pages && page >= 0) {
        this.currentPage = page;
        this.$router.push({ name: 'Home', query: { page } });
      }
    },
  },
};
</script>
