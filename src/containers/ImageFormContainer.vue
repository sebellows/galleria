<template>
  <form novalidate v-on:submit.prevent="onSubmit">
    <div class="form-group d-sm-flex align-items-center">
      <label for="title" class="flex-none mb-0 pr-2" style="min-width: 130px;">Title</label>
      <mico-input class="flex-grow-1" id="title" v-model="formData.title" required />
    </div>

    <div class="form-group d-sm-flex">
      <label for="description" class="flex-none mb-0 pr-2" style="min-width: 130px;"
        >Description</label
      >
      <mico-textarea class="flex-grow-1" id="description" rows="1" v-model="formData.description" />
    </div>

    <div class="form-group d-sm-flex">
      <mico-checkbox
        id="ispublic"
        v-model="formData.ispublic"
        align-label="left"
        label-class="flex-none mb-0 mr-0 pr-1"
      >
        <span class="d-block" style="min-width: 130px;">Public Domain</span>
      </mico-checkbox>
    </div>

    <dl class="inline-dl">
      <dt class="mb-1">ID:</dt>
      <dd class="mb-1">{{ formData.id }}</dd>
      <dt class="mb-1">Owner Name:</dt>
      <dd class="mb-1">{{ formData.ownername }}</dd>
      <dt class="mb-1">Image Dimensions:</dt>
      <dd class="mb-1">{{ formData.dimensions }}</dd>
    </dl>

    <div class="d-flex align-items-center justify-content-end">
      <mico-button id="cancel" class="mr-2" @click.prevent="onCancel">Cancel</mico-button>
      <mico-button type="submit" id="submit" variant="primary" value="Submit" />
    </div>
  </form>
</template>

<script>
/* eslint-disable no-unused-vars */
import MicoButton from '@/components/Button';
import MicoInput from '@/components/TextInput';
import MicoTextarea from '@/components/TextArea';
import MicoCheckbox from '@/components/Checkbox';

export default {
  name: 'image-form',

  components: {
    MicoButton,
    MicoCheckbox,
    MicoInput,
    MicoTextarea,
  },

  props: {
    image: {
      type: Object,
    },
  },

  data() {
    return {
      formData: {
        id: '',
        title: '',
        ispublic: false,
        description: '',
        dimensions: '',
        ownername: '',
        src: '',
        width: '',
        height: '',
      },
      cachedFormData: null,
    };
  },

  async mounted() {
    this.formData = await this.image;
  },

  methods: {
    onCancel(event) {
      this.$emit('cancel', event);
    },

    onSubmit(event) {
      this.$emit('submit', this.formData);
    },
  },
};
</script>
