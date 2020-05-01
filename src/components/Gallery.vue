<template>
  <div class="gallery">
    <ol class="gallery-thumbnails">
      <slot />
    </ol>
  </div>
</template>

<script>
export default {
  name: 'gallery',
};
</script>

<style>
.gallery-thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 2rem;
  list-style: none;
  padding: 0;
}
</style>
