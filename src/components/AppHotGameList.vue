<script setup lang="ts" name="home">
import { GameNavEnum } from '~/types/common';


const gameStore = useGameStore()
const { gameNavData, gameNavInit } = storeToRefs(gameStore)



</script>

<template>
  <div class="app-hot-game-list">
    <AppIndexGameContainer :id="GameNavEnum.Quente" />
    <AppIndexGameContainer :id="GameNavEnum.Dentro_De_Casa" />
    <template v-for="nav in gameNavData">
      <AppIndexGameContainer v-if="gameNavInit[nav.id] && gameNavInit[nav.id].length" :id="nav.id"
        fav-type="rec" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
</style>
<route lang="yaml">
meta:
  layout: home
</route>
