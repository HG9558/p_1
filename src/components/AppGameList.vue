<script setup lang="ts" name="app-game-list">
defineProps<{
    id: string | number
}>()

const gameStore = useGameStore()
const { gameNavInit } = storeToRefs(gameStore)

</script>

<template>
  <div v-if="gameNavInit && gameNavInit[id]" class="app-game-list-container">
    <template v-for="plat in gameNavInit[id]">
      <AppPlatGameBox :id="+id" :platform="plat" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.app-game-list-container {
  // padding-top: 12px;
  position: relative;

  .g-filter {
    position: absolute;
    right: 0;
    top: 28px;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
