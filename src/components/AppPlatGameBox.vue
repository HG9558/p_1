<script setup lang="ts" name="AppPlatGameBox">
import { GameNavEnum } from "~/types/common";

interface Props {
  id: number;
  platform?: any;
  filterType?: string;
}

const props = withDefaults(defineProps<Props>(), {});

// const gameStore = useGameStore()
// const { queryGameTag } = storeToRefs(gameStore) // queryGamePlat

const params = ref<any>({
  game_type: +props.id,
  page: 1,
  page_size: 20,
});

const curListType = ref<"all" | "hot" | "recfav" | "search">("all");

const isNormalGameType = computed(() => {
  return (
    +props.id !== GameNavEnum.Quente && +props.id !== GameNavEnum.Dentro_De_Casa
  );
});

const showBeLoved = ref(false);
const searchKeyWord = ref("");
const curTag = ref("0");

// 不分页的列表数据
const plainGameList = ref<any[]>([]);

// 分页的列表数据
const gameList = ref<any[]>([]);

const total = ref(0);

const isLoading = computed(() => {
  return (
    hotLoading.value ||
    recFavLoading.value ||
    listLoadingSearch.value ||
    listLoading.value
  );
});

// 热门
const { run: runGetHotGames, loading: hotLoading } = useRequest(
  () =>
    ApiGameHotList({
      ty: isNormalGameType.value ? +props.id : 0,
      platform_id: props.platform ? props.platform.id : "0",
      page: params.value.page,
      page_size: params.value.page_size,
    }),
  {
    manual: true,
    onSuccess: (data) => {
      onSuccessPage(data);
    },
  }
);

// 推荐 收藏的游戏
const { run: runGetRecFavGames, loading: recFavLoading } = useRequest(
  () =>
    ApiRecFavGames({
      ty: "0",
      platform_id: props.platform ? props.platform.id : "0",
      page: params.value.page,
      page_size: params.value.page_size,
    }),
  {
    manual: true,
    onSuccess: (data) => {
      onSuccessPage(data);
    },
  }
);

// 收藏
const { run: runGetLovedGames } = useRequest(
  () =>
    ApiLoveGameList({
      ty: "",
      game_type: isNormalGameType.value ? props.id : 0,
      hot: 0,
      platform_id: props.platform ? props.platform.id : "0",
    }),
  {
    manual: true,
    onSuccess: (data) => {
      gameList.value = [];
      plainGameList.value = data ?? [];
    },
  }
);

// 关键词查询 queryGamePlat.value.id queryGameTag.value
const { run: runGetKeyWordGames, loading: listLoadingSearch } = useRequest(
  () =>
    ApiGameKeyWordSearch({
      ty: params.value.game_type,
      page: params.value.page,
      page_size: params.value.page_size,
      w: window.encodeURI(searchKeyWord.value.replace(/\s/g, "")),
      platform_id: props.platform ? props.platform.id : "0",
      tag_id: curTag.value,
    }),
  {
    manual: true,
    onSuccess: (data) => {
      onSuccessPage(data);
    },
    onError: () => {
      gameList.value = [];
    },
  }
);

// queryGamePlat.value.id ||    queryGameTag.value
const { run: getGameList, loading: listLoading } = useRequest(
  () =>
    ApiGameList({
      ...params.value,
      platform_id: props.platform ? props.platform.id : "0",
      tag_id: curTag.value,
    }),
  {
    manual: true,
    onSuccess: (data) => {
      onSuccessPage(data);
    },
    onError: () => {
      gameList.value = [];
    },
  }
);

const onSuccessPage = (data: any) => {
  plainGameList.value = [];
  if (data) {
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
    nextTick(() => {
      bindFunc(true);
    });
  }
};

const initData = () => {
  const val = +props.id;
  params.value.game_type =
    +val !== GameNavEnum.Quente && +val !== GameNavEnum.Dentro_De_Casa
      ? +val
      : undefined;
  params.value.page = 1;
  total.value = 0;
  showBeLoved.value = false;
  searchKeyWord.value = "";
  gameList.value = [];
  plainGameList.value = [];
  if (+val === GameNavEnum.Quente) {
    curListType.value = "hot";
    runGetHotGames();
    return;
  } else if (+val === GameNavEnum.Dentro_De_Casa) {
    curListType.value = "recfav";
    runGetRecFavGames();
  } else {
    curListType.value = "all";
    getGameList();
  }
};

const finished = ref(false);

const loadMoreData = () => {
  if (finished.value) return;
  removeFunc();
  params.value.page = params.value.page + 1;
  if (searchKeyWord.value) {
    runGetKeyWordGames();
    return;
  }
  switch (curListType.value) {
    case "all":
      getGameList();
      break;
    case "hot":
      runGetHotGames();
      break;
    case "recfav":
      runGetRecFavGames();
      break;
    case "search":
      runGetKeyWordGames();
      break;
    default:
      break;
  }
};

const scrollBox = ref();
const lastGameItemRef = ref();

const setLastRef = (ele: any, idx: number) => {
  if (ele && idx === gameList.value.length - 1) {
    lastGameItemRef.value = ele;
  }
};

const scrollFunc = (e: any) => {
  if (lastGameItemRef.value) {
    const { left, width } = lastGameItemRef.value.getBoundingClientRect();
    if (left - window.innerWidth < 1.5 * width) {
      loadMoreData();
    }
  }
};

const bindFunc = (stay?: boolean) => {
  removeFunc();
  if (!stay) {
    scrollBox.value?.scrollTo(0, 0);
  }
  scrollBox.value?.addEventListener("scroll", scrollFunc);
};

const removeFunc = () => {
  scrollBox.value?.removeEventListener("scroll", scrollFunc);
};

watch(gameList, (val, old) => {
  if (val && val.length && (!old || !old.length)) {
    nextTick(() => {
      bindFunc();
    });
  }
});

onMounted(() => {});

onBeforeUnmount(() => {
  removeFunc();
});

initData();
</script>

<template>
  <div class="plat-info">
    <div class="plat" v-if="platform" v-html="platform.name"></div>
  </div>
  <div class="app-plat-game-box">
    <div
      v-if="plainGameList && plainGameList.length"
      class="horizontal-grid"
      :class="{ 'one-row': gameList && gameList.length <= 8 }"
    >
      <AppGameItem
        v-for="item in plainGameList"
        :key="item.id"
        :data="{ ...item, favType: id }"
      />
    </div>
    <template v-else>
      <div
        ref="scrollBox"
        class="horizontal-grid"
        :class="{
          'one-row': gameList && gameList.length <= 8,
          'is-empty-loading': !gameList || gameList.length === 0,
        }"
      >
        <template v-if="gameList && gameList.length > 0">
          <div
            v-for="(item, idx) in gameList"
            :ref="(ele) => setLastRef(ele, idx)"
            :key="item.id"
          >
            <AppGameItem :data="{ ...item, favType: id }" />
          </div>
          <div v-if="isLoading" class="last-loading">
            <AppSpinner :size="46" :stroke-width="10" color="#1373EF" />
          </div>
        </template>
        <div v-else>
          <div v-if="isLoading" class="init-loading">
            <AppSpinner :size="46" :stroke-width="10" color="#1373EF" />
          </div>
          <app-empty
            v-else
            text="Nada aqui"
            :padding-top="1"
            :padding-bottom="1"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.plat-info {
  color: #fff;
  font-size: var(--app-gameTitle-fontSize);
  font-weight: 700;
  padding: 26px 0;
  line-height: 40px;
}

.horizontal-grid {
  // height: 590px;
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

  &.is-empty-loading {
    align-items: center;
    justify-items: center;
    justify-content: center;
  }

  &.overflow-hidden {
    overflow: hidden;
  }

  &.flow-row {
    grid-auto-flow: row;
  }

  .last-loading {
    grid-row-start: 1;
    grid-row-end: 3;
    width: 120px;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.loading-empty {
  width: 100%;
  // min-height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overflow-hidden {
  overflow: hidden;
}

.inline-block {
  display: inline-block;
}

.app-plat-game-box {
  // background: linear-gradient(180deg, #044B9A 0%, #011A51 100%), #1B2E1B;
  margin-left: -20px;
  margin-right: -20px;
  border-radius: 0;
  padding-left: 20px;
  padding-right: 20px;
}

.app-game-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  --app-game-item-height: 224px;
  grid-column-gap: 20px;
  grid-row-gap: 14px;
  padding: 30px 0;
}
</style>
