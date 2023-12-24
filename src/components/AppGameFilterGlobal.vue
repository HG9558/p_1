<script lang="ts" setup name="AppGameFilterGlobal">
import { GameNavEnum } from "~/types/common";

interface Props {
  id: GameNavEnum;
  setFilterGameParam?: Function;
}

const props = withDefaults(defineProps<Props>(), {
  setFilterGameParam: () => {},
});

const route = useRoute();

const filterIcons = [
  {
    value: 1,
    label: "hot",
    show: () => props.id !== GameNavEnum.Quente,
  },
  {
    value: 2,
    label: "love",
  },
  {
    value: 3,
    label: "search",
  },
];

const appStore = useAppStore();
const { isLogin } = storeToRefs(appStore);

const activeIcon = ref();

const showBottom = ref(false);

const searchValue = ref("");

const closeDialog = () => {
  showBottom.value = false;
};

const searchConfirm = () => {
  if (listLoadingSearch.value) return;
  if (searchValue.value && searchValue.value.trim().length) {
    params.value.page = 1;
    runGetKeyWordGames();
  }
};

const changeCategoryItem = (item: any) => {
  switch (item.value) {
    case 1:
      if (activeIcon.value === item.value) {
        activeIcon.value = "";
        props.setFilterGameParam("");
      } else {
        activeIcon.value = item.value;
        props.setFilterGameParam(item.label);
      }
      break;
    case 2:
      if (isLogin.value) {
        if (activeIcon.value === item.value) {
          activeIcon.value = "";
          props.setFilterGameParam("");
        } else {
          activeIcon.value = item.value;
          props.setFilterGameParam(item.label);
        }
      } else {
        appStore.setLoginDialogVisible(true);
      }
      break;
    case 3:
      showBottom.value = true;
      break;
    default:
      break;
  }
};

const finished = ref(false);

const total = ref(0);

const params = ref<any>({
  game_type: +props.id,
  page: 1,
  page_size: 15,
});

const gameList = ref<any>([]);

// 关键词查询 queryGamePlat.value.id queryGameTag.value
const { run: runGetKeyWordGames, loading: listLoadingSearch } = useRequest(
  () =>
    ApiGameKeyWordSearch({
      ty:
        props.id === GameNavEnum.Dentro_De_Casa ||
        props.id === GameNavEnum.Quente
          ? 0
          : params.value.game_type,
      page: params.value.page,
      page_size: params.value.page_size,
      w: window.encodeURI(searchValue.value.trim().replace(/\s/g, "")),
      platform_id: "0",
      tag_id: "0",
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

const refresh = () => {};

watch(route, () => {
  activeIcon.value = "";
  searchValue.value = "";
});
</script>

<template>
  <div class="app-game-filter-global">
    <ul>
      <template v-for="item in filterIcons" :key="item.value">
        <li v-if="item.show ? item.show() : true" class="">
          <AppImage
            :src="
              activeIcon === item.value
                ? `/icons/i-gfilter-${item.value}.png`
                : `/icons/i-gfilter-${item.value}-no.png`
            "
            alt=""
            @click="changeCategoryItem(item)"
          />
        </li>
      </template>
    </ul>
  </div>
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
            @refresh="refresh"
            @loadMoreData="loadMoreData"
          >
            <div class="app-game-list">
              <AppGameItem
                v-for="item in gameList"
                :key="item.id"
                :data="{ ...item, favType: id }"
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
.app-game-filter-global {
  ul {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;

    li {
      img {
        width: 60px;
      }
    }
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
