<template>
  <div id="app" class="container">
    <icon-sprite />
    <header class="text-center py-3">
      <h1>Image Gallery</h1>
      <form novalidate>
        <div class="mx-auto mb-3" style="max-width: 400px;">
          <label for="image-filter">Search</label>
          <Autocomplete :items="records" itemKey="name" :value="query">
            <div class="autocomplete mb-3" slot-scope="{ results, listeners: { keydown, blur } }">
              <div class="input-group">
                <mico-input
                  v-model="query"
                  class="autocomplete-input"
                  type="search"
                  placeholder="Search..."
                  name="image-filter"
                  :value="query"
                  autocomplete="off"
                  novalidate
                />
                <div class="input-group-append">
                  <span class="input-group-text">
                    <mico-icon name="search" />
                  </span>
                </div>
              </div>
              <ul v-show="results && results.length" class="autocomplete-menu">
                <li v-for="result in results" :key="result.name">
                  <a href="#">{{ result.name }}</a>
                </li>
              </ul>
            </div>
          </Autocomplete>
          <small>Displaying {{ imageCount }} of {{ totalImages }} images</small>
        </div>
      </form>
    </header>

    <gallery v-if="images.length">
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
import IconSprite from '@/views/partials/IconSprite';
import Autocomplete from '@/controllers/Autocomplete.js';
import ImageForm from '@/containers/ImageFormContainer';
import Gallery from '@/components/Gallery';
import GalleryThumbnail from '@/components/GalleryThumbnail';
import MicoIcon from '@/components/Icon';
import MicoInput from '@/components/TextInput';
import MicoModal from '@/components/Modal';
import MicoPagination from '@/components/Pagination';

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
    Autocomplete,
    Gallery,
    GalleryThumbnail,
    IconSprite,
    ImageForm,
    MicoIcon,
    MicoInput,
    MicoModal,
    MicoPagination,
  },

  data() {
    return {
      // Gallery
      isLoading: false,
      // A store for previously paginated pages
      store: new Map(),
      // Autocomplete, Gallery, & Pagination
      imageCount: 8, // Number of images to display in gallery
      totalImages: 100, // Total number of images handled by API
      // Autocomplete
      query: '', // Sent to API to fetch matching records
      records: [], // All matching records in the API
      results: [], // filtered records returned by API
      // Pagination
      pages: 13,
      currentPage: 1,
      // Gallery
      images: [], // The current page's displayed images from API
      isFiltered: false, // Are the images from filtered results from API
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
  },

  watch: {
    currentPage: {
      handler(currentPage, prevPage) {
        if (currentPage !== prevPage) {
          this.fetchResults();
        }
      },
      // deep: true,
    },
  },

  methods: {
    async fetchResults() {
      return fetch(`/api/photos?pageNumber=${this.currentPage}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Unable to load images.');
          }
          return response.json();
        })
        .then(({ totalPhotos, photos }) => {
          this.pages = totalPhotos;
          return photos.map((item) => imageModelFactory(item));
        })
        .then((images) => {
          if (this.images.length) {
            // Cache the previous images
            this.store.set(this.currentPage, this.images);
          }
          this.images = [];
          images.forEach(async (image, i) => {
            const cachedImage = await this.$ls.get(`${image.id}`);
            if (isDefined(cachedImage) && cachedImage instanceof Promise === false) {
              this.images.push(cachedImage);
            } else {
              this.images.push(image);
            }
          });
        })
        .catch((err) => {
          throw new Error(`Unable to complete request: ${err}`);
        });
    },
    filterOffers(filtered) {
      this.offers = filtered;
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
    updateGallery($event, index) {
      if (index <= this.pages && index >= 0) {
        this.currentPage = index;
      }
    },
  },
};
</script>
