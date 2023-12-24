<script setup lang="ts" name="app-empty">
withDefaults(defineProps<{
  paddingTop?: number;
  paddingBottom?: number;
  text?: string
}>(), {
  text: 'Sem dados'
})

</script>
<template>
  <div class="app-empty" :style="{
    paddingTop: `var(--app-px-${paddingTop ?? 230})`,
    paddingBottom: `var(--app-px-${paddingBottom ?? 230})`
  }">
    <AppImage class="icon" src="/img/empty.png" alt="" />
    <slot>{{ text }}</slot>
  </div>
</template>

<style lang="scss" scoped>
.app-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 26px;
  color: #fff;

  .icon {
    width: 192px;
  }
}
</style>
