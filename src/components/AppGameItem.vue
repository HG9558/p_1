<script setup lang="ts" name="AppGameItem">
import { GameItem } from '~/types/common';

interface Props {
  data: GameItem
}

const props = withDefaults(defineProps<Props>(), {})

// const router = useRouter()

const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)

const gameStore = useGameStore()
const { gameNavInit } = storeToRefs(gameStore)

const plat = computed(() => {
  if (gameNavInit.value && gameNavInit.value[props.data.game_type]) {
    return gameNavInit.value[props.data.game_type].filter((p: any) => p.id === props.data.platform_id)[0]
  }
  return undefined
})

// const isLoading = ref(true);

// const imgLoad = () => {
//   isLoading.value = false;
// }

// const { run: runInsertLoveGame } = useRequest(() => ApiInsertLoveGame({ id: props.data.id, ty: props.data.game_type }), {
//   manual: true,
//   onSuccess: () => {
//     beLoved.value = true
//   }
// })

// const { run: runDeleteLoveGame } = useRequest(() => ApiDeleteLoveGame({ id: props.data.id }), {
//   manual: true,
//   onSuccess: () => {
//     beLoved.value = false
//   }
// })

// const isFav = computed(() => +props.data.is_fav === 1 ? true : false)

// const beLoved = ref(+props.data.is_fav === 1 ? true : false)

// const loveGame = () => {
//   if (!isLogin.value) {
//     appStore.setLoginDialogVisible(true)
//   } else {
//     if (beLoved.value) {
//       runDeleteLoveGame()
//     } else {
//       runInsertLoveGame()
//     }
//   }
// }

// const { run: runLunch } = useRequest(() => ApiLunchGame({ pid: props.data.platform_id + '', code: props.data.game_id }), {
//   manual: true,
//   onSuccess: (data) => {
//     if (data && data.indexOf('http') !== -1) {
//       router.push({ path: '/launch-game', query: { url: data } })
//       // window.open(data)
//     }
//   }
// })

const lunchGame = () => {
  if (isLogin.value) {
    // runLunch()
    gameStore.setGameItemPopupVisible(true, props.data)
  } else {
    appStore.setLoginDialogVisible(true)
  }
}
</script>

<template>
  <div class="app-game-item">
    <div class="item_content">
      <!-- <div class="item_content_focus">
        <AppImage class="focus_img" :class="{ loved: beLoved }"
          :src="(beLoved) ? '/icons/i-fav.png' : '/icons/i-focus.png'" alt="" @click="loveGame" />
      </div> -->
      <!-- <AppLoading v-if="isLoading" class="game-loading" /> -->
      <!-- <AppSpinner v-if="isLoading" :size="46" :stroke-width="10" color="#1373EF" /> -->
      <!-- <div class="game-img" :style="{backgroundImage: 'url(https://dlbnjwqjykhbd.cloudfront.net'+data.img+')'}" @click="lunchGame"></div> -->
      <!-- <div class="game-img" v-lazy:background-image="isFullPath(data.img || '') ? data.img : brazilImg + data.img"
        @click="lunchGame"></div> -->
      <AppImage class="game-img" :src="'https://dlbnjwqjykhbd.cloudfront.net'+data.img" @click="lunchGame" />
    </div>
    <div class="title">
      <div class="text">
        {{ data.br_alias || (plat ? plat.name : '') }}
      </div>
    </div>
  </div>
</template>
<style>
:root {
  --app-game-item-height: 210px;
  --app-game-item-width: 200px;
}
</style>
<style lang="scss" scoped>
.app-game-item {
  width: var(--app-game-item-width);
  scroll-snap-align: start;
  // background: rgba(32, 53, 91, 0.5);
  // background: rgba(14, 48, 117, 0.5);
  background: #122039;
  border-radius: 16px;

  .game-img {
    width: var(--app-game-item-width);
    height: var(--app-game-item-height);
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity .5s;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    object-fit: cover;
    border-radius: 16px;
    overflow: hidden;
  }

  .game-img[lazy=loading] {
    opacity: 0;
  }

  .game-img[lazy=error] {}

  .game-img[lazy=loaded] {
    opacity: 1;
  }

  img.game-img[lazy=loading] {
    opacity: 0;
  }

  img.game-img[lazy=error] {}

  img.game-img[lazy=loaded] {
    opacity: 1;
  }

  .item_content {
    width: var(--app-game-item-width);
    height: var(--app-game-item-height);
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .item_content_focus {
      width: 35px;
      height: 35px;
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 0 16px 0 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;

      .focus_img {
        width: 18px;
      }
    }
  }

  .title {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 28px;
    padding-top: 7px;
    padding-bottom: 7px;
    overflow: hidden;
    padding-left: 12px;
    padding-right: 12px;
    word-break: break-all;
    height: 70px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .text {
      max-height: 56px;
      overflow: hidden;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
    }
  }

}
</style>
