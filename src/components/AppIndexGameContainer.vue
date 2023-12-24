<template>
  <div class="app-index-game-container">
    <template v-if="isRequestLoading && props.id === 100">
      <div class="loading_container">
        <van-loading color="#1989fa" size="44px" />
      </div>
    </template>
    <template v-else>
      <AppIndexTitle :id="id" />
      <div
        v-if="renderList && renderList.length"
        class="app-maps game-container"
      >
        <div class="content" :class="{ 'one-row': renderList.length <= 7 }">
          <AppGameItem
            class="game-item"
            v-for="(item, idx) in renderList"
            :key="item.id + idx"
            :data="{ ...item, favType: favType ? favType : id }"
          />
          <div v-if="id !== GameNavEnum.Quente" class="more">
            <div @click="liClick(id)">
              <AppImage src="/icons/more.png" alt="" class="img" />
              <AppImage src="/icons/more.png" alt="" class="img" />
              <AppImage src="/icons/more.png" alt="" class="img" />
              <p class="txt">Mais</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <app-empty text="Nada aqui" :padding-top="60" :padding-bottom="60" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts" name="app-index-game-container">
import { GameNavEnum } from "~/types/common";

defineOptions({
  name: "AppIndexGameContainer",
});

interface Props {
  id: GameNavEnum;
  filterType?: string;
  favType?: string;
}
const props = defineProps<Props>();
const isRequestLoading = ref(true);

const liClick = inject<any>("liClick");

// 首页 获取推荐的 热门 游戏 100
// 首页 获取推荐的 收藏 游戏 101
const { run: runGetSpecialRec, data: specialRecGames } = useRequest(
  () =>
    +props.id === GameNavEnum.Quente
      ? ApiGameHotList({
          ty: 0,
          platform_id: "0",
          page_size: 20,
          page: 1,
          is_fav: props.filterType === "love" ? 1 : undefined,
        })
      : ApiRecFavGames({
          ty: "0",
          platform_id: "0",
          page_size: 19,
          page: 1,
          is_fav: props.filterType === "love" ? 1 : undefined,
        }),
  {
    manual: true,
    onBefore: () => {
      if (+props.id === GameNavEnum.Quente) {
        isRequestLoading.value = true;
      }
    },
    onSuccess: () => {
      if (+props.id === GameNavEnum.Quente) {
        isRequestLoading.value = false;
      }
    },
  }
);

const { run: runGetNormalRec, data: recGames } = useRequest(
  () =>
    ApiGameRecList({
      ty: +props.id,
      platform_id: "0",
      page_size: 19,
      page: 1,
      is_fav: props.filterType === "love" ? 1 : undefined,
    }),
  {
    manual: true,
  }
);

// 收藏
const { run: runGetLovedGames, data: favedGames } = useRequest(
  () =>
    ApiLoveGameList({
      ty: _ty.value + "",
      platform_id: "0",
      hot: 0,
      game_type:
        props.id === GameNavEnum.Quente ||
        props.id === GameNavEnum.Dentro_De_Casa
          ? 0
          : props.id,
    }),
  {
    manual: true,
  }
);

const _ty = computed(() => {
  if (props.id) {
    if (props.id === GameNavEnum.Dentro_De_Casa) {
      return "fav";
    } else if (props.id === GameNavEnum.Quente) {
      return "hot";
    } else if (props.favType === "rec") {
      return "rec";
    } else {
      return "";
    }
  }
  return "";
});

if (
  +props.id !== GameNavEnum.Quente &&
  +props.id !== GameNavEnum.Dentro_De_Casa
) {
  runGetNormalRec();
} else {
  runGetSpecialRec();
}

const renderList = computed(() => {
  if (props.filterType === "love") {
    return favedGames.value || [];
  }
  if (
    +props.id !== GameNavEnum.Quente &&
    +props.id !== GameNavEnum.Dentro_De_Casa
  ) {
    return recGames.value?.d;
  } else {
    return specialRecGames.value?.d;
  }
});

watch(
  () => props.filterType,
  (val, old) => {
    if (val === "love") {
      runGetLovedGames();
      return;
    }
    if (
      +props.id !== GameNavEnum.Quente &&
      +props.id !== GameNavEnum.Dentro_De_Casa
    ) {
      runGetNormalRec();
    } else {
      runGetSpecialRec();
    }
  }
);
</script>

<style lang="scss" scoped>
.app-maps.game-container {
  margin-left: -20px;
  margin-right: -20px;
  border-radius: 0;
}
.app-maps {
  border-radius: 0px 30px 30px 30px;
  padding: 0 18px;
  padding-bottom: 8px;

  .content {
    display: grid;
    grid-template-rows: auto auto;
    grid-auto-flow: column;
    grid-column-gap: 12px;
    grid-row-gap: 12px;
    scroll-snap-type: x mandatory;
    overflow: auto hidden;
    align-items: start;
    justify-items: start;
    // grid-template-columns: repeat(auto-fill, 200px);
    &.one-row {
      grid-template-rows: auto;
      justify-content: flex-start;
      // height: 295px;
    }
    .left {
      width: 12px;
      scroll-snap-align: start;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .more {
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.6);

    .img {
      width: 12px;
      display: inline-block;
      margin-right: 8px;
    }

    .txt {
      color: rgba(255, 255, 255, 0.6);
      font-size: 24px;
    }
  }
}

.loading_container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>
