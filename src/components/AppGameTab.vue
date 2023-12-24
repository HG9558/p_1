<template>
  <div class="app-game-tab-sec">
    <div class="left">
      <van-tabs
        ref="gameTabRef"
        :swipe-threshold="4"
        line-height="0"
        background="transparent"
        line-width="0"
        class="game-type-tabs"
      >
        <van-tab v-for="(item, i) in gameNavData" :key="item.id">
          <template #title>
            <div
              :ref="(ele) => setTabRef(ele, item.id)"
              class="n-tab-item"
              @click="liClick(item.id)"
              :class="{
                active: currentActive === i,
              }"
            >
              <AppImage
                class="icon"
                :src="`/icons/gty_${item.id}.png`"
                alt=""
              />
            </div>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <div class="search-box">
      <AppGameSearch />
    </div>
  </div>
  <AppHotGameList v-show="clickId === 100" />
  <AppFavGameList v-show="clickId === 101" />
  <template v-for="item in gameNavData.slice(2)" :key="item.id">
    <AppGameList v-show="clickId === item.id" :id="item.id" />
  </template>
</template>

<script setup lang="ts" name="app-game-tab">
defineProps({
  text: String,
});

const gameStore = useGameStore();
const { gameNavData, needResizeGameTypeTab } = storeToRefs(gameStore);

const clickId = ref(100);

// const navBoxRef = ref()
const gameTabRef = ref();

const currentActive = computed(() => {
  return gameNavData.value.findIndex((item) => item.id === clickId.value);
});

const liClick = (id: any) => {
  clickId.value = id;
  nextTick(() => {
    document.querySelector("#scroll-top")?.scrollIntoView();
  });
};

// watch(route, (val, old) => {
//   if (val.path === '/') {
//     clickId.value = GameNavEnum.Quente
//     return
//   }
//   if (val.path === '/rec-fav-game') {
//     clickId.value = GameNavEnum.Dentro_De_Casa
//     return
//   }
//   if (val.path.indexOf('/game-list/') === -1) {
//     clickId.value = -1
//   } else {
//     clickId.value = +route.params.id
//   }
// }, { immediate: true })

watch(needResizeGameTypeTab, (val) => {
  if (val) {
    // liClick(val)
    // gameTabRef.value?.resize()
    tabsRefs.value[val.id]?.click();
  }
});

const tabsRefs = ref<any>({});

const setTabRef = (ele: any, id: any) => {
  tabsRefs.value[id] = ele;
};

provide("liClick", liClick);
</script>

<style lang="scss" scoped>
.app-game-tab-sec {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;

  .search-box {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      display: block;
      width: 66px;
    }
  }

  .left {
    flex: 1;
    overflow: hidden;
    height: 84px;

    .n-tab-item {
      flex: 1;
      flex-basis: auto;
      width: 84px;
      height: 84px;
      flex-shrink: 0;
      border-radius: 10px;
      // background: #0B1C3D;
      padding-top: 3px;
      padding-left: 3px;

      &.active {
        // background: #F5C31B;
        background: rgba(0, 52, 166, 0.8);
      }

      img {
        width: 78px;
        height: 78px;
        display: block;
      }
    }
  }

  .nav-box {
    display: flex;
    gap: 20px;
    flex-wrap: nowrap;
    height: 110px;
    overflow-x: scroll;

    .n-item {
      flex: 1;
      flex-basis: auto;
      width: 84px;
      height: 84px;
      flex-shrink: 0;
      border-radius: 10px;
      background: #0b1c3d;

      &.active {
        background: #f5c31b;
      }

      img {
        width: 78px;
        height: 78px;
        display: block;
        margin-top: 5px;
        margin-left: 5px;
      }
    }
  }
}

.app-game-tab {
  height: 148px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #033377;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  overflow: hidden;

  .item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #fff;
    line-height: 24px;
    font-size: 26px;
    padding-left: 14px;

    &.active {
      background: linear-gradient(358deg, #1373ef 0%, #0ed1f4 100%),
        linear-gradient(180deg, #044b9a 0%, #011a51 100%);
    }

    .icon {
      width: 50px;
      margin-right: 6px;
    }
  }
}
</style>
