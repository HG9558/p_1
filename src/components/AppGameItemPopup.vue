<template>
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    :style="{ height: 'var(--app-px-440)' }"
    teleport="body"
    class="app-game-item-popup"
    @close="close"
  >
    <div v-if="gameItemData" class="game-item-popup-content">
      <div class="info">
        <div class="left">
          <div
            class="game-img"
            v-lazy:background-image="
              isFullPath(gameItemData.img || '')
                ? gameItemData.img
                : brazilImg + gameItemData.img
            "
          ></div>
        </div>
        <div class="right">
          <h3 class="name">{{ gameItemData.br_alias }}</h3>
          <p class="plat-name">{{ platformName }}</p>
          <div class="focus">
            <AppImage
              class="focus_img"
              :class="{ loved: beLoved }"
              :src="beLoved ? '/icons/i-fav-big.png' : '/icons/i-fav-big-n.png'"
              alt=""
              @click="loveGame"
            />
          </div>
        </div>
      </div>
      <AppImage
        src="/icons/i-close-white.png"
        class="closeicon"
        @click="close"
      />
      <AppButton
        :loading="lunchLoading"
        width="712"
        height="90"
        blue-to-right
        bold
        center
        font-size="28"
        round
        whiteText
        @click="lunchGame"
        >Modo real</AppButton
      >
    </div>
  </van-popup>
</template>

<script lang="ts" setup name="AppGameItemPopup">
import { GameNavEnum } from "~/types/common";

const router = useRouter();
const commonStaete = useCommonState();

const appStore = useAppStore();
const { isLogin } = storeToRefs(appStore);

const gameStore = useGameStore();
const { gameItemPopupVisible, gameItemData, gameNavInit } =
  storeToRefs(gameStore);

const platformName = computed(() => {
  if (
    gameNavInit.value &&
    gameItemData.value &&
    gameNavInit.value[gameItemData.value.game_type]
  ) {
    const obj = gameNavInit.value[gameItemData.value.game_type].filter(
      (i: any) => i.id === gameItemData.value.platform_id
    )[0];
    if (obj) {
      return obj.name;
    }
    return "";
  }
  return "";
});

const _ty = computed(() => {
  if (gameItemData.value) {
    if (
      gameItemData.value.favType === GameNavEnum.Dentro_De_Casa ||
      gameItemData.value.favType === "fav"
    ) {
      return "fav";
    } else if (gameItemData.value.favType === GameNavEnum.Quente) {
      return "hot";
    } else if (gameItemData.value.favType === "rec") {
      return "rec";
    } else {
      return "";
    }
  }
  return "";
});

const { run: runInsertLoveGame } = useRequest(
  () => ApiInsertLoveGame({ id: gameItemData.value.id, ty: "" }),
  {
    manual: true,
    onSuccess: () => {
      beLoved.value = true;
      commonStaete.changeSaveList(gameItemData.value.id);
    },
  }
);

const { run: runDeleteLoveGame } = useRequest(
  () => ApiDeleteLoveGame({ id: gameItemData.value.id }),
  {
    manual: true,
    onSuccess: () => {
      beLoved.value = false;
      commonStaete.changeSaveList(gameItemData.value.id);
    },
  }
);

// const isFav = computed(() => +props.data.is_fav === 1 ? true : false)

const beLoved = ref(false);

const loveGame = () => {
  if (!isLogin.value) {
    appStore.setLoginDialogVisible(true);
  } else {
    if (beLoved.value) {
      runDeleteLoveGame();
    } else {
      runInsertLoveGame();
    }
  }
};

const { run: runLunch, loading: lunchLoading } = useRequest(
  () =>
    ApiLunchGame({
      pid: gameItemData.value.platform_id + "",
      code: gameItemData.value.game_id,
    }),
  {
    manual: true,
    onSuccess: (data) => {
      if (data && data.indexOf("http") !== -1) {
        router.push({ path: "/launch-game", query: { url: data } });
        // window.open(data)
      }
    },
    onAfter: () => {
      gameStore.setGameItemPopupVisible(false);
    },
  }
);

const lunchGame = () => {
  if (isLogin.value) {
    runLunch();
  } else {
    appStore.setLoginDialogVisible(true);
  }
};

const showBottom = ref(false);

watch(gameItemPopupVisible, (val, old) => {
  showBottom.value = val;
});

watch(gameItemData, (val) => {
  if (val) {
    beLoved.value = +val.is_fav === 1 ? true : false;
  }
});

const close = () => {
  gameStore.setGameItemPopupVisible(false);
};
</script>

<style lang="scss" scoped>
.game-item-popup-content {
  width: 100%;
  height: 100%;
  background-color: #011a51;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: relative;

  .closeicon {
    position: absolute;
    right: 30px;
    top: 30px;
    width: 34px;
  }

  .info {
    padding: 30px;
    padding-bottom: 24px;
    display: flex;
    gap: 32px;
    align-items: flex-start;
    justify-content: flex-start;
    color: #fff;
    font-size: 32px;
    font-weight: 700;
    overflow: hidden;

    .left {
      width: 270px;

      .game-img {
        width: 270px;
        height: 270px;
        border-radius: 16px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }
    }

    .right {
      padding-top: 30px;
      line-height: 56px;
      flex: 1;
      width: 0;

      img {
        width: 35px;
      }

      p {
        color: rgba(255, 255, 255, 0.6);
        font-size: 24px;
        font-weight: 400;
      }

      .focus {
        padding-top: 20px;
        line-height: 1;
      }

      .name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>
