<script setup lang="ts" name="AppLoading">
const props = withDefaults(defineProps<{
  width?: number;
  borderWidth?: number
}>(), {
  width: 60,
  borderWidth: 10
});
</script>

<template>
  <div class="app-loading" :style="{
    width: `var(--app-px-${props.width})`,
    height: `var(--app-px-${props.width})`,
    borderWidth: `var(--app-px-${props.borderWidth})`,
  }"></div>
</template>

<style lang="scss" scoped>
.app-loading {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 10px solid white;
  border-top-color: transparent;
  animation: loading 1.5s linear infinite;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg)
  }
}
</style>
