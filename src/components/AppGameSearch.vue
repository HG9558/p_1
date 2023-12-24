<script setup lang="ts" name="game-search">
const showBottom = ref(false);
const searchValue = ref("");

const closeDialog = () => {
  showBottom.value = false;
};

const finished = ref(false);
const total = ref(0);
const gameList = ref<any>([]);
const params = ref({
  page: 1,
  page_size: 15,
});
// 关键词查询 queryGamePlat.value.id queryGameTag.value
const { run: runGetKeyWordGames, loading: listLoadingSearch } = useRequest(
  () =>
    ApiGameKeyWordSearch({
      ty: 0,
      page: params.value.page,
      page_size: params.value.page_size,
      w: window.encodeURI(searchValue.value.trim().replace(/\s/g, "")),
      platform_id: "0",
      tag_id: "0",
    }),
  {
    manual: true,
    onSuccess: (data) => {
      if (params.value.page === 1) {
        total.value = data.t;
        gameList.value = [];
      }
      if (data.d && data.d.length) {
        gameList.value = gameList.value.concat(data.d);
      }
      if (
        (params.value.page === 1 &&
          gameList.value.length < params.value.page_size) ||
        (gameList.value.length &&
          total.value > 0 &&
          gameList.value.length >= total.value)
      ) {
        finished.value = true;
      } else {
        finished.value = false;
      }
    },
    onError: () => {
      gameList.value = [];
    },
  }
);

const searchConfirm = () => {
  if (listLoadingSearch.value) return;
  if (searchValue.value && searchValue.value.trim().length) {
    params.value.page = 1;
    runGetKeyWordGames();
  }
};

const loadMoreData = () => {
  if (finished.value) return;
  params.value.page = params.value.page + 1;
  if (searchValue.value) {
    runGetKeyWordGames();
    return;
  }
};
</script>

<template>
  <!-- <div class="game-search" @click="showBottom = true">
    <AppImage src="/icons/i-search.png" />
    <span>To search for</span>
  </div> -->
  <AppImage
    class="search-icon"
    :src="`/icons/i-search-b.png`"
    alt=""
    @click="showBottom = true"
  />

  <van-popup
    v-model:show="showBottom"
    class="van-popup-transparent"
    position="bottom"
    teleport="body"
    :style="{ height: '100%' }"
  >
    <div class="filter-content" @click="closeDialog">
      <div @click.stop>
        <div class="title1">Category</div>
        <div class="input">
          <AppInput
            v-model="searchValue"
            width="auto"
            placeholder="To search for"
            clearable
            :style-obj="{ paddingLeft: 'var(--app-px-26)' }"
          >
            <template #right>
              <div class="search-right-btn" @click="searchConfirm">
                <AppImage src="/icons/i-search-default.png" alt="" />
              </div>
            </template>
          </AppInput>
        </div>
        <div class="search-result">
          <AppList
            :loading="listLoadingSearch"
            :finished="finished"
            @loadMoreData="loadMoreData"
          >
            <div class="app-game-list">
              <AppGameItem
                v-for="item in gameList"
                :key="item.id"
                :data="{ ...item, favType: 0 }"
              />
            </div>
          </AppList>
        </div>
      </div>
      <AppImage
        class="close"
        src="/icons/dialog-close.png"
        alt=""
        @click="closeDialog"
      />
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.search-icon {
  width: 60px;
}
.game-search {
  width: 712px;
  height: 72px;
  border-radius: 100px;
  border: 1px solid rgba(4, 75, 154, 0.5);
  background: linear-gradient(0deg, #000a1d 0%, #000a1d 100%), #2a2e3e;
  display: flex;
  align-items: center;
  color: #969799;
  font-size: 26px;
  padding-left: 26px;
  margin-top: 24px;

  img {
    width: 28px;
    margin-right: 11px;
  }
}

.search-right-btn {
  width: 76px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 32px;
  }
}

.app-game-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  --app-game-item-height: 224px;
  grid-column-gap: 20px;
  grid-row-gap: 14px;
  padding: 30px 0;
}

.filter-content {
  height: 100%;
  color: #fff;
  padding: 110px 20px;
  background: rgba(0, 0, 0, 0.45);
  position: relative;

  .close {
    position: absolute;
    width: 40px;
    right: 32px;
    top: 32px;
  }

  .filter-tab-list {
    // grid，每行显示 3 个
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 27px;
  }

  .title1 {
    text-align: center;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 40px;
  }

  .title2 {
    font-size: 32px;
    padding: 30px 0 24px 0;
  }
}
</style>
