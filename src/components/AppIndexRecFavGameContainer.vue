<script setup lang="ts" name="app-index-rev-fav-game-container">
// 推荐收藏页面游戏
import { GameNavEnum } from '~/types/common';

interface Props {
  id: GameNavEnum
  filterType?: string
}
const props = defineProps<Props>()

const params = ref<any>({
  page: 1,
  page_size: 19,
})

const liClick = inject<any>('liClick')

// 首页 获取推荐的 热门 游戏 100
// 首页 获取推荐的 收藏 游戏 101
const { run: runGetSpecialRec, data: specialRecGames } = useRequest(() => ApiRecFavGames({ ty: props.id+'', platform_id: '0', page_size: params.value.page_size, page: 1 }), {
  manual: true
})

runGetSpecialRec()

// 收藏
const { run: runGetLovedGames, data: favedGames } = useRequest(() => ApiLoveGameList({ ty: 'fav', platform_id: '0', hot: 0, game_type: props.id }), {
  manual: true,
})

// 热门
const { run: runGetHotGames, loading: hotLoading } = useRequest(() => ApiGameHotList({ty: +props.id, platform_id: '0', page: 1, page_size: params.value.page_size}), {
  manual: true,
  onSuccess: (data) => {
    onSuccessPage(data)
  }
})

const gameList = ref([])
const onSuccessPage = (data: any) => {
  // plainGameList.value = []
  if (data) {
    if (params.value.page === 1) {
      // total.value = data.t
      gameList.value = []
    }
    if (data.d && data.d.length) {
      gameList.value = gameList.value.concat(data.d)
    }
    // if ((params.value.page === 1 && gameList.value.length < params.value.page_size) || (gameList.value.length && total.value > 0 && gameList.value.length >= total.value)) {
    //   finished.value = true;
    // } else {
    //   finished.value = false
    // }
  }
}

const renderList = computed(() => {
  if (props.filterType === 'love') {
    return favedGames.value
  }
  if (props.filterType === 'hot') {
    return gameList.value
  }
  return specialRecGames.value?.d
})


watch(() => props.filterType, (val, old) => {
  params.value.page = 1
  // total.value = 0
  // gameList.value = []
  if (val === 'love') {
    runGetLovedGames()
    return
  }
  if (val === 'hot') {
    runGetHotGames()
    return
  }
  runGetSpecialRec()
  // if (val === 'hot') {
  //   return
  // }
  // if (val === 'love') {
  //   return
  // }
  // getGameList()
})

</script>

<template>
  <div v-if="renderList && renderList.length" class="app-index-rec-fav-game-container">
    <AppIndexTitle :id="id" />
    <div class="app-maps game-container">
      <div class="content" :class="{'one-row': gameList && gameList.length <= 7, 'is-empty-loading': !renderList || renderList.length === 0}">
        <!-- <div class="left"></div>
        <div class="left"></div> -->
        <AppGameItem class="game-item" v-for="(item, idx) in renderList" :key="item.id + idx" :data="{...item, favType: 'fav'}" />
        <div class="more">
          <div @click="liClick(id)">
            <AppImage src="/icons/more.png" alt="" class="img" />
            <AppImage src="/icons/more.png" alt="" class="img" />
            <AppImage src="/icons/more.png" alt="" class="img" />
            <p class="txt">Mais</p>
          </div>
        </div>
        <!-- <div class="left"></div>
        <div class="left"></div> -->
      </div>
    </div>
    <!-- <div v-else>
      <app-empty text="Nada aqui" :padding-top="60" :padding-bottom="60" />
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.app-maps.game-container {
  margin-left: -20px;
  margin-right: -20px;
  border-radius: 0;
}
.app-maps {
  border-radius: 0px 30px 30px 30px;
  // background: linear-gradient(180deg, #044B9A 0%, #011A51 100%), #1B2E1B;
  // padding-top: 17px;
  padding: 0 18px;
  padding-bottom: 8px;


  .content {
    // height: 590px;
    display: grid;
    grid-template-rows: auto auto;
    grid-auto-flow: column;
    grid-column-gap: 12px;
    grid-row-gap: 12px;
    scroll-snap-type: x mandatory;
    overflow: auto hidden;
    align-items: start;
    justify-items: start;

    .left {
      width: 12px;
      scroll-snap-align: start;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    &.one-row {
      grid-template-rows: auto;
      justify-content: flex-start;
      // height: 295px;
    }

    &.is-empty-loading {
      align-items: center;
      justify-items: center;
      justify-content: center;
    }
  }

  .more {
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.60);

    .img {
      width: 12px;
      display: inline-block;
      margin-right: 8px;
    }

    .txt {
      color: rgba(255, 255, 255, 0.60);
      font-size: 24px;
    }
  }
}
</style>
