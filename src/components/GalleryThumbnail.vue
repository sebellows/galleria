<template>
  <li :id="id" class="gallery-thumbnail">
    <figure class="gallery-figure">
      <a :href="href" class="gallery-link" @click.stop="onClick">
        <picture>
          <source
            v-if="srcset"
            :srcset="srcset"
            media="(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-device-pixel-ratio: 1.5), (min-resolution: 1.5dppx)"
          />
          <source :srcset="src" media="(min-width: 1440px)" />
          <img :src="src" :alt="caption" />
        </picture>
        <div class="gallery-image-scrim" aria-hidden="true">
          <span class="gallery-fab">
            <mico-icon size="96" name="edit" />
          </span>
        </div>
      </a>
      <figcaption class="gallery-caption">{{ caption }}</figcaption>
    </figure>
  </li>
</template>

<script>
import MicoIcon from './Icon';

export default {
  name: 'gallery-thumbnail',

  components: {
    MicoIcon,
  },

  props: {
    id: {
      type: String,
      default: '',
    },
    href: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
    srcset: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      default: '',
    },
  },

  methods: {
    onClick(event) {
      event.preventDefault();
      this.$emit('click', event);
    },
  },
};
</script>

<style>
.gallery-thumbnail {
  list-style-type: none;
  position: relative;
}
.gallery-figure {
  background-color: var(--white);
  position: relative;
  overflow: hidden;
}
.gallery-link {
  border-radius: 0.5rem;
  display: block;
  max-width: 100%;
  height: 0;
  padding-bottom: 75%;
  position: relative;
  overflow: hidden;
}
.gallery-link::before,
.gallery-link::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0.5rem;
  pointer-events: none;
}
.gallery-link::before {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 8.1%,
    rgba(0, 0, 0, 0.001) 15.5%,
    rgba(0, 0, 0, 0.003) 22.5%,
    rgba(0, 0, 0, 0.005) 29%,
    rgba(0, 0, 0, 0.008) 35.3%,
    rgba(0, 0, 0, 0.011) 41.2%,
    rgba(0, 0, 0, 0.014) 47.1%,
    rgba(0, 0, 0, 0.016) 52.9%,
    rgba(0, 0, 0, 0.019) 58.8%,
    rgba(0, 0, 0, 0.022) 64.7%,
    rgba(0, 0, 0, 0.025) 71%,
    rgba(0, 0, 0, 0.027) 77.5%,
    rgba(0, 0, 0, 0.029) 84.5%,
    rgba(0, 0, 0, 0.03) 91.9%,
    rgba(0, 0, 0, 0.03) 100%
  );
}
.gallery-link::after {
  background: linear-gradient(
    180deg,
    transparent 62%,
    rgba(0, 0, 0, 0.00345888) 63.94%,
    rgba(0, 0, 0, 0.014204) 65.89%,
    rgba(0, 0, 0, 0.0326639) 67.83%,
    rgba(0, 0, 0, 0.0589645) 69.78%,
    rgba(0, 0, 0, 0.0927099) 71.72%,
    rgba(0, 0, 0, 0.132754) 73.67%,
    rgba(0, 0, 0, 0.177076) 75.61%,
    rgba(0, 0, 0, 0.222924) 77.56%,
    rgba(0, 0, 0, 0.267246) 79.5%,
    rgba(0, 0, 0, 0.30729) 81.44%,
    rgba(0, 0, 0, 0.341035) 83.39%,
    rgba(0, 0, 0, 0.367336) 85.33%,
    rgba(0, 0, 0, 0.385796) 87.28%,
    rgba(0, 0, 0, 0.396541) 89.22%,
    rgba(0, 0, 0, 0.4) 91.17%
  );
  transition: opacity 0.3s ease;
  opacity: 0;
}
.gallery-link:hover::after {
  opacity: 1;
}
.gallery-image-scrim {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 1.25rem;
  font-size: 0.825rem;
  line-height: 2;
  transition: opacity 0.3s ease;
  opacity: 0;
}
.gallery-link:hover .gallery-image-scrim {
  opacity: 1;
}
.gallery-fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  background-color: var(--white);
  box-shadow: var(--shadow-0), var(--shadow-1);
  color: var(--dark);
  padding: 0.375rem;
}
.gallery-thumbnail img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  pointer-events: none;
}
.gallery-caption {
  font-size: 0.75rem;
  font-weight: 700;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
</style>
