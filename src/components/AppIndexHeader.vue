<script setup lang="ts" name="app-index-header">
import { GameNavEnum } from "~/types/common";
import { openLink } from "~/utils/utils";
const appStore = useAppStore();
const { isLogin, custService } = storeToRefs(appStore);

const gameStore = useGameStore();
const { gameNavData } = storeToRefs(gameStore);

const showLeft = ref(false);
const showAddToDesktop = ref(false);
const url = ref(location.origin);
const setShowLeft = (value: boolean) => {
  showLeft.value = value;
};
const copyUrl = () => {
  copy(url.value);
  showToast("Copied!");
};

const setShowAddToDesktop = (value: boolean) => {
  showAddToDesktop.value = value;
};

const openUrl = (url?: string) => {
  if (!url) return;
  openLink(url);
};

const { isIos } = getBrowser();
const { data: downloadUrl } = useRequest(() =>
  getAppDownloadUrl(isIos ? 36 : 35)
);

const promos = [
  {
    path: "/promotion-detail/invite",
    icon: "bonus-orange.png",
    title: "Bônus",
  },
  // {
  //   path: '/promotion-detail/reward-box',
  //   icon: 'promo-pink.png',
  //   title: 'Pomoção'
  // },
];

const route = useRoute();
const { id } = route.params;

const clickId = ref(+id);

const currentActive = computed(() => {
  return gameNavData.value.findIndex((item) => item.id === clickId.value);
});

const liClick = (item: any) => {
  clickId.value = item.id;
  // if (item.path) {
  //   router.push(item.path)
  //   return
  // }
  // router.push(`/game-list/${item.id}`)
  gameStore.setNeedResizeGameTypeTab(item);
};

const hahaClose = (func: any) => {
  if (func) func();
  setTimeout(() => {
    showLeft.value = false;
  }, 0);
};

const downloadApp = () => {
  if (isIos) {
    showAddToDesktop.value = true;
  } else {
    openUrl(downloadUrl.value?.url);
  }
};

watch(
  route,
  (val, old) => {
    if (val.path === "/") {
      clickId.value = GameNavEnum.Quente;
      return;
    }
    if (val.path === "/rec-fav-game") {
      clickId.value = GameNavEnum.Dentro_De_Casa;
      return;
    }
    if (val.path.indexOf("/game-list/") === -1) {
      clickId.value = -1;
    } else {
      clickId.value = +route.params.id;
    }
  },
  { immediate: true }
);
</script>

<template>
  <header class="app-index-header">
    <div class="left">
      <button class="popup-btn" @click="setShowLeft(true)">
        <AppImage class="img" src="/icons/i-popup-btn.png" alt="" srcset="" />
      </button>
      <a class="logo" @click="$router.push('/')">
        <AppImage class="img" src="/icons/logo.png" alt="" />
      </a>
    </div>
    <div class="right">
      <AppIndexHeaderUserAmount v-if="isLogin" />
      <div v-else class="login-reg">
        <AppButton
          @click="() => openLoginDialog(true)"
          width="195"
          height="60"
          bold
          font-size="26"
          orange
          :radius="100"
        >
          Conecte-se
        </AppButton>
        <AppButton
          @click="() => openRegisterDialog(true)"
          width="152"
          height="60"
          bold
          font-size="26"
          blue
          :radius="100"
          white-text
        >
          registro
        </AppButton>
      </div>
      <!-- <button class="message" @click="router.push('/notice-list')">
        <AppImage class="img" src="/icons/i-message.png" alt="" srcset="" />
      </button> -->
    </div>
  </header>
  <van-popup
    v-model:show="showLeft"
    class="van-popup-dark"
    teleport="body"
    position="left"
    :style="{ height: '100%' }"
  >
    <div class="nav-pop">
      <div class="navimg">
        <AppImage
          src="/icons/i-popup-btn.png"
          alt=""
          srcset=""
          @click="setShowLeft(false)"
        />
      </div>
      <div v-if="isLogin">
        <AppIndexLeftUserInfo />
      </div>
      <div v-else class="login-reg">
        <AppButton
          @click="hahaClose(() => openLoginDialog(true))"
          width="195"
          height="60"
          bold
          font-size="26"
          orange
          :radius="100"
        >
          Conecte-se
        </AppButton>
        <AppButton
          @click="hahaClose(() => openRegisterDialog(true))"
          width="152"
          height="60"
          bold
          font-size="26"
          blue
          :radius="100"
          white-text
        >
          registro
        </AppButton>
      </div>
      <div class="promos-box">
        <ul>
          <li v-for="p in promos" :key="p.path">
            <AppImage
              :src="'/icons/' + p.icon"
              @click="hahaClose(() => $router.push(p.path))"
            />
          </li>
        </ul>
      </div>
      <div class="nav-box">
        <ul>
          <li
            v-for="(nav, idx) in gameNavData"
            @click="hahaClose(() => liClick(nav))"
            :key="nav.id"
            :class="{
              active: currentActive === idx,
            }"
          >
            <AppImage
              :src="
                (currentActive === idx ? '/icons/gyts_on_' : '/icons/gyts_') +
                nav.id +
                '.png'
              "
            />
            <span class="title">{{ nav.name }}</span>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="nav-box">
        <ul>
          <li
            @click="hahaClose(() => $router.push('/promotion-detail/telegram'))"
          >
            <AppImage src="/icons/nav_tg.png" />
            <span class="title">Canal De Telegram</span>
          </li>
          <li @click="hahaClose(() => $router.push('/vip'))">
            <AppImage src="/icons/nav_vip.png" />
            <span class="title">Introdução ao nível VIP</span>
          </li>
          <li @click="hahaClose(() => downloadApp())">
            <AppImage src="/icons/nav_down.png" />
            <span class="title">Baixar aplicativo</span>
          </li>
          <li @click="hahaClose(() => openUrl(custService?.onlinecs))">
            <AppImage src="/icons/nav_online.png" />
            <span class="title">Serviço on-line</span>
          </li>
        </ul>
      </div>
      <div class="warn-txt">
        Copie o link e cole-o no navegador do seu computador para abri-lo em seu
        computador
      </div>
      <div class="copy-container">
        <input v-model="url" type="text" class="input" disabled />
        <AppButton
          @click="copyUrl()"
          class="btn"
          width="150"
          height="70"
          bold
          font-size="28"
          blue-to-bottom
          :radius="8"
          white-text
        >
          Cópia
        </AppButton>
      </div>
    </div>
  </van-popup>
  <van-popup v-model:show="showAddToDesktop">
    <div class="add-desktop">
      <AppImage class="img" src="/img/add-to-desktop.png" />
      <div class="close" @click="setShowAddToDesktop(false)">
        <AppImage src="/icons/dialog-close.png" />
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.add-desktop {
  .img {
    width: 100%;
  }
  .close {
    margin: 0 auto;
    padding: 30px 0;
    text-align: center;
    img {
      width: 40px;
    }
  }
}
.copy-container {
  border-radius: 56px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(16, 25, 41, 0.6);
  width: 440px;
  height: 72px;
  line-height: 72px;
  display: flex;
  padding-left: 24px;
  overflow: hidden;
  margin-left: 52px;

  input {
    flex: 1;
    background: transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
    font-size: 26px;
    font-weight: 400;
    border: none;
  }

  button {
    border-radius: 0 60px 60px 0 !important;
  }
}

.nav-pop {
  background: #0c1a36;
  box-shadow: 10px 0px 26px 0px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  width: 540px;
  min-height: 100%;
  padding-bottom: 100px;

  .line {
    width: 476px;
    height: 2px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    margin-left: 32px;
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .navimg {
    padding: 34px 32px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    img {
      width: 40px;
    }
  }

  .promos-box {
    margin-top: 40px;

    ul {
      margin: 0;
      padding: 0;
      display: flex;
      gap: 18px;
      align-items: center;
      justify-content: flex-start;
      // justify-content: center;

      li {
        img {
          width: 228px;
        }
      }
    }
  }

  .nav-box {
    padding-left: 32px;

    ul {
      li {
        height: 82px;
        width: 476px;
        color: rgba(255, 255, 255, 0.4);
        font-size: 30px;
        font-weight: 400;
        line-height: 24px;
        border-radius: 10px;
        display: flex;
        gap: 30px;
        padding-left: 28px;
        align-items: center;
        justify-content: flex-start;

        img {
          width: 40px;
        }

        &.active {
          background: rgba(32, 53, 91, 0.5);
          color: rgba(255, 255, 255, 0.9);
          font-size: 30px;
          font-weight: 700;
        }
      }
    }
  }

  .warn-txt {
    color: #ffd500;
    font-size: 24px;
    font-weight: 400;
    line-height: 30px;
    text-align: left;
    width: 436px;
    margin-left: 52px;
    margin-top: 16px;
    margin-bottom: 16px;
  }
}

.login-reg {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.input-container {
  height: 72px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(0deg, #000a1d 0%, #000a1d 100%),
    linear-gradient(0deg, #011a51 0%, #011a51 100%), #2a2e3e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;

  .input {
    background-color: transparent;
    border: none;
    color: #fff;
    height: 100%;
    flex: 1;
    padding: 0 20px;
    font-size: 28px;
  }
}

.left-content {
  width: 600px;
  height: 100%;
  background: linear-gradient(0deg, #011a51 0%, #011a51 100%), #d9d9d9;

  .b-content {
    padding: 25px 20px;

    .btn-margin {
      margin-bottom: 12px;
    }

    .telegram-img {
      width: 50px;
      height: 50px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }

      .tip {
        position: absolute;
        top: 0;
        right: 0;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        line-height: 15px;
        text-align: center;
        background-color: #fe7e8d;
        color: #fff;
      }
    }

    .tips {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      color: #ffd500;
      text-align: center;
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-top: 30px;
    }
  }

  .top {
    display: flex;
    justify-content: flex-end;
    // padding: 20px 20px 0 0;
    height: 106px;

    .top-btn {
      padding: 0 40px;

      .img {
        width: 40px;
        height: 40px;
        vertical-align: middle;
      }
    }
  }
}

button {
  border: none;
  background: none;
  outline: none;
}

.left {
  display: flex;
  align-items: center;

  .popup-btn {
    padding: 12px 8px 12px 20px;

    .img {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      transform: rotate(180deg);
    }
  }

  .logo {
    width: 128px;
    display: inline-block;

    .img {
      width: 100%;
      vertical-align: middle;
    }
  }
}

.right {
  display: flex;
  justify-content: center;
  align-items: center;

  .message {
    width: 60px;
    height: 60px;
    border-radius: 60px;
    background: linear-gradient(180deg, rgba(46, 50, 69, 0) 0%, #011a51 100%);
    box-shadow: 0px 1px 4px 0px rgba(255, 255, 255, 0.3) inset,
      0px 1px 0px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 20px 0 10px;

    .img {
      width: 46px;
    }
  }
}

.app-index-header {
  height: 110px;
  // background: linear-gradient(180deg, #044B9A 0%, #011A51 100%), linear-gradient(180deg, #1D1F2C 0%, #252734 100%);
  // background-color: #035ACA;
  background: #0034a6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100vw;
  left: 0;
  top: 0;
  z-index: 100;

  .right {
    margin-right: 20px;
  }
}

.activity {
  height: 70px;
  display: flex;
  align-items: center;
  color: #fff;

  .img {
    width: 40px;
    vertical-align: middle;
    margin-right: 22px;
    margin-left: 10px;
  }
}

.style4 {
  margin-bottom: 20px;
}
</style>
