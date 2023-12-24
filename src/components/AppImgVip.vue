<script setup lang="ts" name="app-img-vip">
withDefaults(defineProps<{
  vipLevel: string | number;
  width?: string | number;
  height?: string | number;
}>(), {
  vipLevel: 0,
})
</script>

<template>
  <div class="app-img-vip" :style="{
    width: width ? $toPx(+width) : '',
    height: height ? $toPx(+height) : '',
  }">
    <AppImage :src="`/img/vipbadge/n-vip${vipLevel}.png`" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.app-img-vip {
  width: 142px;
  height: 162px;

  img {
    width: 100%;
  }
}
</style>
