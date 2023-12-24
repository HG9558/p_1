<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    isGame?: boolean;
  }>(),
  {
    isGame: false,
    isGoogleCloud: false
  }
);

const isWebp = ref(props.src.includes('.webp'))
const isGif = ref(props.src.includes('.gif'));
const isSvg = ref(props.src.includes('.svg'));
const isHttp = ref(props.src.includes('http://'))
const isHttps = ref(props.src.includes('https://'))
const suffixWebp = Array.from(document.documentElement.classList).includes('webp');

const src = computed(() => {
  let _src = props.src

  if (!suffixWebp || isWebp.value || isGif.value || isSvg.value || isHttp.value || isHttps.value) return _src

  if (props.isGame) {
    _src = import.meta.env.VITE_GAMEIMG_URL + _src
  }

  return `${_src}.webp`;
});
</script>

<template>
  <img class="app-image" :src="src" :alt="props.alt" loading="lazy" />
</template>

<style lang="scss" scoped></style>
