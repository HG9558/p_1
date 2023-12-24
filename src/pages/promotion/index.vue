<template>
  <div class="promotion">
    <AppHeader leftArrow title="Promoção" placeholder />
    <div class="tab-bg" :style="{ top: isApp ? 0 : '' }">
      <div class="tab">
        <AppTab :listData="typeList" :height="100" v-model="currentType" />
      </div>
    </div>
    <div class="list">
      <div
        v-if="showList.length > 0"
        class="item"
        v-for="(item, i) in showList"
        :key="i"
      >
        <AppImage
          class="banner"
          :src="`/img/promotion/${item.banner}.png`"
          alt=""
          @click="router.push(item.path)"
        />
        <div class="detail">
          <p>
            <span class="title">{{ item.title }}</span
            ><br />
            <span class="time">{{ item.time }}</span>
          </p>
          <AppButton
            @click="router.push(item.path)"
            font-size="28"
            bold
            white-text
            round
            width="150"
            height="54"
            blue-to-bottom
            >Mais</AppButton
          >
        </div>
      </div>
      <AppEmpty v-else />
    </div>
  </div>
</template>

<script setup lang="ts" name="promotion">
const router = useRouter();
const { isApp } = storeToRefs(useAppStore());

const currentType = ref("0");
const typeList = [
  { label: "Tudo", value: "0" }, // 全部
  { label: "Depósito", value: "1" }, // 存款活动
  { label: "Baixar APP", value: "2" }, // 未知
  { label: "Desconto", value: "3" }, // 未知
  { label: "Classificação", value: "4" }, // 未知
  { label: "Outros", value: "5" }, // 箱子、签到
];
const list = [
  {
    path: "/promotion-detail/first-deposit",
    type: "1",
    banner: "list-firstdeposit",
    title: "Primeiro depósito + bônus de 20%",
    time: "20/06/2023 - Longo prazo",
  },
  {
    path: "/promotion-detail/deposit-bonus",
    type: "1",
    banner: "list-depositbonus",
    title: "Benefícios-ofertasdedeposito Ate 1...",
    time: "20/06/2023 - Longo prazo",
  },
  {
    path: "/promotion-detail/check-in",
    type: "5",
    banner: "list-checkin",
    title: "Recompensa de check-in",
    time: "20/06/2023 - Longo prazo",
  },
  // {
  //   path: "/promotion-detail/reward-box",
  //   type: "5",
  //   banner: "list-rewardbox",
  //   title: "Jackpot de desempacotar",
  //   time: "20/06/2023 - Longo prazo",
  // },
  {
    path: "/promotion-detail/refund",
    type: "5",
    banner: "list-refund",
    title: "Apostas cumulativas semanais, bônus de até 30%!",
    time: "20/06/2023 - Longo prazo",
  },
];

const showList = computed(() => {
  if (currentType.value === "0") return list;
  return list.filter((a) => a.type === currentType.value);
});
</script>

<style lang="scss" scoped>
.promotion {
  background-color: #000a1e;
}

.tab-bg {
  background-color: #000a1e;
  position: fixed;
  top: 110px;

  .tab {
    background-image: linear-gradient(to bottom, #011a5100, #011a51);
    width: 750px;
  }
}

.list {
  padding: 130px 30px 124px;
  box-sizing: border-box;

  .item {
    width: 688px;
    height: 343px;
    border: 2px solid #0ed1f4;
    border-radius: 20px;
    color: #fff;
    margin-bottom: 30px;
    overflow: hidden;

    .banner {
      width: 100%;
      height: 248px;
      object-fit: cover;
      display: block;
    }

    .detail {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      align-items: center;
      height: 95px;
      padding: 0 25px;
      justify-content: space-between;

      p {
        .title {
          display: inline-block;
          width: 473px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 28px;
          font-weight: 700;
        }

        .time {
          color: rgba(255, 255, 255, 0.7);
          font-size: 24px;
        }
      }
    }
  }
}
</style>
