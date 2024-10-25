<template>
  <div class="app-index-layout-container">
    <!-- <div class="g-filter">
      <AppGameFilterGlobal :id="+GameNavEnum.Quente" :setFilterGameParam="setFilterGameParam" />
    </div> -->
    <!-- <AppIndexGameContainer :id="GameNavEnum.Quente" class="game-container-list" />
    <AppIndexGameContainer :id="GameNavEnum.Dentro_De_Casa" class="game-container-list" />
    <template v-for="nav in gameNavData">
      <AppIndexGameContainer v-if="gameNavInit[nav.id] && gameNavInit[nav.id].length" :id="nav.id"
        class="game-container-list" fav-type="rec" />
    </template> -->
    <AppIndexLatestWin class="index-latest-win" />
    <div class="index-container">
      <div class="index-title">Provedores de jogos</div>
      <AppImage class="jobs-img" src="/img/jobs.png" alt="" />
      <div class="index-line"></div>
    </div>
    <div class="index-container">
      <div class="index-title">Entre em contato conosco</div>
      <AppImage
        class="index-b-img index-b-img-lx"
        src="/img/index-b-f.png"
        alt=""
        @click="() => openService(custService?.facebook)"
      />
      <AppImage
        class="index-b-img index-b-img-lx"
        src="/img/index-b-t.png"
        alt=""
        @click="() => openService(custService?.telegram)"
      />
      <div class="index-line"></div>
    </div>
    <div class="index-container">
      <div class="index-title">Método de pagamento</div>
      <AppImage
        class="index-b-img index-b-img-139"
        src="/img/index-b-p.png"
        alt=""
      />
      <div class="index-line"></div>
    </div>
    <div class="index-container">
      <div class="index-title">Responsabilidade</div>
      <AppImage
        class="index-b-img index-b-img-92"
        src="/img/index-b-r.png"
        alt=""
      />
      <div class="index-title-2">
        A LB88 opera através de Elektra Entertainment B.V., com número de
        registro 157256 e domicílio social em Julianaplein 36 Willemstad,
        Curaçao, certificada pelo governo de Curaçao através da Licença
        8048/JAZ2021-105 emitida para prestação de serviço de Cassino e apostas
        esportivas.
      </div>
    </div>
    <div class="bottom-link">
      <div class="line-item">
        <AppImage class="link-img" src="/icons/bottom1.png" alt="" srcset="" />
        <div class="link-title">Safe<br />payment</div>
      </div>
      <div class="line-item" @click="() => openService(custService?.onlinecs)">
        <AppImage class="link-img" src="/icons/bottom2.png" alt="" srcset="" />
        <div class="link-title">24/7<br />support</div>
      </div>
      <div class="line-item">
        <AppImage class="link-img" src="/icons/bottom3.png" alt="" srcset="" />
        <div class="link-title">Mobile<br />friends</div>
      </div>
      <div class="line-item">
        <AppImage class="link-img" src="/icons/bottom4.png" alt="" srcset="" />
        <div class="link-title">Highest<br />odds</div>
      </div>
      <div class="line-item">
        <AppImage class="link-img" src="/icons/bottom5.png" alt="" srcset="" />
        <div class="link-title">Multi-<br />currency</div>
      </div>
    </div>
    <div class="copyright">Copyright © All Rights Reserved by LB88</div>
  </div>
</template>

<script setup lang="ts" name="home">
import { GameNavEnum } from "~/types/common";
import { openLink } from "~/utils/utils";

const appStore = useAppStore();
const { custService } = storeToRefs(appStore);

const gameStore = useGameStore();
const { gameNavData, gameNavInit } = storeToRefs(gameStore);

const s =1;

const openService = (url?: string) => {
  if (!url) return;
  openLink(url);
};

const filterType = ref("");

const setFilterGameParam = (v: string) => {
  filterType.value = v;
};
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
