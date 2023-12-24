<template>
  <div class="app-index-layout-container">
    <!-- <div class="g-filter">
      <AppGameFilterGlobal :id="+GameNavEnum.Dentro_De_Casa" :setFilterGameParam="setFilterGameParam" />
    </div> -->

    <!-- 用户收藏 -->
    <div class="fav-wrapper" v-if="isLogin">
      <h6 class="title">minha coleção</h6>
      <div class="box game-container">
        <div
          v-if="favList && favList.length > 0"
          class="game-list"
          :class="{ 'one-row': favList && favList.length <= 8 }"
        >
          <AppGameItem
            class="game-item"
            v-for="(item, idx) in favList"
            :key="item.id + idx"
            :data="{ ...item, favType: 'fav' }"
          />
        </div>
        <div v-else>
          <app-empty text="Nada aqui" :padding-top="60" :padding-bottom="60" />
        </div>
      </div>
    </div>

    <template v-for="nav in gameNavData">
      <AppIndexRecFavGameContainer
        v-if="gameNavInit[nav.id] && gameNavInit[nav.id].length"
        :id="nav.id"
        class="game-container-list"
        :filter-type="filterType"
      />
    </template>
  </div>
</template>

<script setup lang="ts" name="RecGavGame">
const gameStore = useGameStore();
const { gameNavData, gameNavInit } = storeToRefs(gameStore);
const appStore = useAppStore();
const { isLogin } = storeToRefs(appStore);
const commonState = useCommonState();

const filterType = ref("");

watch(
  () => commonState.saveList,
  () => {
    fetchFavedGames();
  },
  {
    deep: true,
  }
);

const favedGames = ref([]);

const fetchFavedGames = async () => {
  if (isLogin.value) {
    const response = await ApiLoveGameList({
      ty: "",
      platform_id: "0",
      hot: 0,
      game_type: 0,
    });
    favedGames.value = response as any;
  }
};

// 初始化时调用一次
fetchFavedGames();

const favList = computed(() => favedGames.value);

// 其他逻辑...
</script>

<style lang="scss" scoped>
.app-index-layout-container {
  position: relative;
  .g-filter {
    position: absolute;
    right: 0;
    top: 28px;
  }
}
.fav-wrapper {
  .box.game-container {
    margin-left: -20px;
    margin-right: -20px;
    border-radius: 0;
  }

  .box {
    border-radius: 0px 4vw 4vw 4vw;
    // background: linear-gradient(180deg, #044B9A 0%, #011A51 100%), #1B2E1B;
    padding: 0 18px;

    .game-list {
      padding-bottom: 8px;
      display: grid;
      grid-template-rows: auto auto;
      grid-auto-flow: column;
      grid-column-gap: 12px;
      grid-row-gap: 12px;
      scroll-snap-type: x; // x mandatory;
      overflow: auto hidden;
      align-items: start;
      justify-items: start;

      &::-webkit-scrollbar {
        display: none;
      }

      &.one-row {
        grid-template-rows: auto;
        justify-content: flex-start;
        height: 295px;
      }
      .game-item {
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .title {
    font-size: var(--app-gameTitle-fontSize);
    color: #fff;
    font-weight: 700;
    text-transform: capitalize;
    line-height: 40px;
    padding: 26px 0;
  }
}

.game-container-list {
  // padding-top: 30px;
}

.index-latest-win {
  margin-top: 80px;
}

.index-title {
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  padding-top: 30px;
  padding-bottom: 27px;
}

.jobs-img {
  width: 100%;
}

.index-line {
  position: relative;
  width: 100%;
  margin-top: 39px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px dashed #828eb4;
    pointer-events: none;
    transform: scaleY(0.5);
    transform-origin: top left;
  }
}

.index-b-img {
  vertical-align: middle;
}

.index-b-img-lx {
  width: 76px;

  &:not(:last-child) {
    margin-right: 30px;
  }
}

.index-b-img-139 {
  width: 139px;
}

.index-b-img-92 {
  width: 92px;
}

.index-title-2 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 26px;
  padding-top: 40px;
}

.bottom-link {
  color: #ccced2;
  text-align: center;
  font-size: 22px;
  display: flex;
  justify-content: space-around;
  padding: 35px 0 50px 0;

  .link-img {
    height: 51px;
  }
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 24px;
  height: 94px;
  background: #011a51;
  line-height: 94px;
}
</style>
<route lang="yaml">
meta:
  layout: home
</route>
