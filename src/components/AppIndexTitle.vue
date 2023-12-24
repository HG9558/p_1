<script setup lang="ts" name="app-index-title">
import { GameNavEnum } from '~/types/common'
interface Props {
  id: GameNavEnum
}
const props = withDefaults(defineProps<Props>(), {})

const router = useRouter()

const gameStore = useGameStore()
const { gameNavData } = storeToRefs(gameStore)

const gameType = computed(() => {
  if (gameNavData.value) {
    return gameNavData.value.filter(i => i.id === props.id)[0]
  }
  return undefined
})

const goPage = () => {
  if (props.id === GameNavEnum.Quente) {
    return
  }
  if (props.id === GameNavEnum.Dentro_De_Casa) {
    router.push('/rec-fav-game')
    return
  }
  router.push('/game-list/' + props.id)
}

// const hahaIcons = [
//   { id: GameNavEnum.Quente, icon: '', },
//   { id: GameNavEnum.Dentro_De_Casa, icon: '' },
//   { id: GameNavEnum.Slot, icon: '' },
//   { id: GameNavEnum.Pesca, icon: '' },
//   { id: GameNavEnum.Pôquer, icon: '' },
//   { id: GameNavEnum.Esporte, icon: '' },
//   { id: GameNavEnum.Ao_Vivo, icon: '' },
// ]

</script>

<template>
  <div class="app-index-title">
    <!-- <AppImage class="t-img" :src="`/img/index-title${id}.png`" alt="" /> -->
    <!-- <div class="title-1">Recomendações</div> -->
    <!-- <AppImage class="title-img" :src="`/icons/g_title_${id}.png`" /> -->
    <!-- <span>Recomendações </span> -->
    <div class="left"><span v-if="gameType">{{ gameType.name }}</span></div>
    <div v-if="id !== GameNavEnum.Quente" class="right">
      <span @click="goPage">More</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title-img {
  width: 55px;
}
.app-index-title {
  width: 100%;
  color: #FFF;
  font-size: var(--app-gameTitle-fontSize);
  font-weight: 700;
  line-height: 40px;
  padding-bottom: 26px;
  padding-top: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
  }
  .right {
    color: rgba(255,255,255,0.6);
    font-size: 24px;
    font-weight: 500;
    line-height: 40px;
  }

  .title-1 {
    margin-bottom: 5px;
  }

  .t-img {
    width: 100%;
    vertical-align: middle;
  }
}
</style>
