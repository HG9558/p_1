<script setup lang="ts" name="app-game-list">

const gameStore = useGameStore()
const { gameNavInit } = storeToRefs(gameStore)

const route = useRoute()

const id = computed(() => +route.params.id)

const filterType = ref('')

const setFilterGameParam = (v: string) => {
  filterType.value = v
}

</script>

<template>
  <div v-if="gameNavInit && gameNavInit[id]" class="app-game-list-container">
    <!-- <div class="g-filter">
      <AppGameFilterGlobal v-if="+id > 0" :id="+id" :setFilterGameParam="setFilterGameParam" />
    </div> -->
    <!-- <pre style="color: #fff">
        {{ gameNavInit[id] }}
      </pre> -->
    <template v-for="plat in gameNavInit[id]">
      <AppPlatGameBox :id="id" :platform="plat" />
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
