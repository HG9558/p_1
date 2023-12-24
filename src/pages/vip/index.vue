<script setup lang="ts" name="vip">
const swipeWidth = window.innerWidth * (700 / 750);
const suffixWebp = Array.from(document.documentElement.classList).includes(
  "webp"
);
const cardImg = `url('/img/vip/card.png${suffixWebp ? ".webp" : ""}')`;

const router = useRouter();
const { userInfo } = storeToRefs(useAppStore());
const userLevel = computed(() => (userInfo.value.vip || 1) - 1); // 用户等级
const nowValidFlow = computed(() =>
  userInfo.value.now_valid_amount ? userInfo.value.now_valid_amount : 0
); // 当前流水
const nowValidDeposit = computed(() =>
  userInfo.value.now_deposit ? userInfo.value.now_deposit : 0
); // 当前充值
const upgradeProgress = computed(() => {
  // 升级进度
  const flowPrecent = +nowValidFlow.value / +nextLevelData.value.flow;
  const depositPrecent =
    +nowValidDeposit.value / +nextLevelData.value.deposit_amount;
  const total =
    (flowPrecent >= 1 ? 1 : flowPrecent) * 50 +
    (depositPrecent >= 1 ? 1 : depositPrecent) * 50;
  return Number.isNaN(total) ? 0 : toDecimal(total, 0);
});

const showLevel = ref(userLevel.value);
const { data: vipList } = useRequest(ApiGetMemberVip);
const showData = computed(() =>
  vipList.value
    ? vipList.value[showLevel.value]
    : {
        free_withdraw_num: 0,
        withdraw_limit: 0,
        amount: 0,
        deposit_amount: 0,
        flow: 0,
      }
);
const nextLevelData = computed(() => {
  if (vipList.value && showLevel.value < vipList.value.length - 1) {
    return vipList.value[showLevel.value + 1];
  } else {
    return {
      free_withdraw_num: 0,
      withdraw_limit: 0,
      amount: 0,
      deposit_amount: 0,
      flow: 0,
    };
  }
});

const onChange = (index: number) => {
  showLevel.value = index;
};
</script>
<template>
  <div class="vip">
    <AppHeader title="Privilégio VIP" leftArrow :fixed="false" />
    <AppImage class="bg" src="/img/vip/banner.png" alt="" />
    <div class="body">
      <!-- 等级轮播 -->
      <van-swipe
        @change="onChange"
        :initial-swipe="userLevel"
        :loop="false"
        class="my-swipe"
        :width="swipeWidth"
        :show-indicators="false"
      >
        <van-swipe-item v-for="(item, i) in vipList" :key="i">
          <div class="swipe-item">
            <div class="top">
              <AppImgVip :vipLevel="item.vip" />
              <div
                v-show="vipList && i !== vipList?.length - 1"
                class="progress-box"
              >
                <AppProgress
                  class="progress"
                  :width="348"
                  max="100"
                  :value="upgradeProgress"
                />
                <span>{{ upgradeProgress }}/100</span>
              </div>
            </div>
            <div class="bottom">
              <div class="data">
                <label>R${{ toDecimal(item.deposit_amount, 0) }}</label>
                <span
                  >Depósito<br />
                  cumulativo</span
                >
              </div>
              <div class="data">
                <label>R${{ toDecimal(item.flow, 0) }}</label>
                <span
                  >Requisitos<br />
                  de fluxo</span
                >
              </div>
              <div class="data">
                <label
                  >R${{ toDecimal(userInfo.now_valid_amount ?? 0, 0) }}</label
                >
                <span
                  >Valor da<br />
                  experiência</span
                >
              </div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>

      <!-- 钱包 -->
      <div class="wallet">
        <div class="wallet-item">
          <AppImage src="/icons/i-withdarw.png" alt="" />
          <label>{{ showData.free_withdraw_num }}</label>
          <span
            >Número de saques<br />
            por dia</span
          >
        </div>
        <div class="wallet-item">
          <AppImage src="/icons/i-bet-record.png" alt="" />
          <label>R${{ toDecimal(showData.withdraw_limit, 0) }}</label>
          <span
            >Limite diário<br />
            de retirada</span
          >
        </div>
        <div class="wallet-item">
          <AppImage src="/icons/i-vip2.png" alt="" />
          <label>R${{ toDecimal(showData.amount, 0) }}</label>
          <span
            >Bônus de<br />
            atualização</span
          >
        </div>
      </div>

      <div class="wrapper">
        <!-- 进度 -->
        <div
          class="rest-part"
          v-show="vipList && showLevel < vipList?.length - 1"
        >
          <h6>Distância próximo nível:</h6>
          <div class="box">
            <p>
              Quantidade total de recarga:
              <span class="money-text"
                >{{ toDecimal(nowValidDeposit) }} /
                {{ nextLevelData.deposit_amount }}</span
              >
            </p>
            <div class="progress">
              <AppProgress
                :width="480"
                :max="nextLevelData.deposit_amount"
                :value="nowValidDeposit"
              />
              <AppButton
                bold
                shadow
                width="140"
                height="56"
                yellow-to-bottom
                :radius="16"
                @click="router.push('/finance?tab=deposit')"
                >IR</AppButton
              >
            </div>
          </div>
          <div class="box">
            <p>
              Número total de apostas:
              <span class="money-text"
                >{{ toDecimal(nowValidFlow) }} / {{ nextLevelData.flow }}</span
              >
            </p>
            <div class="progress">
              <AppProgress
                :width="480"
                :max="nextLevelData.flow"
                :value="nowValidFlow"
              />
              <AppButton
                bold
                shadow
                width="140"
                height="56"
                font-size="32"
                yellow-to-bottom
                :radius="16"
                @click="router.push('/')"
                >IR</AppButton
              >
            </div>
          </div>
        </div>

        <!-- table -->
        <div class="table-bg">
          <div class="table-wrapper">
            <table>
              <colgroup>
                <col style="width: var(--app-px-158)" />
                <col style="width: var(--app-px-154)" />
                <col style="width: var(--app-px-195)" />
                <col style="width: var(--app-px-151)" />
              </colgroup>
              <thead>
                <tr>
                  <th>Nivel</th>
                  <th>Prêmios</th>
                  <th>Recompensa</th>
                  <th>Aderecos</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in vipList" :key="i">
                  <td class="money-text">vip{{ item.vip }}</td>
                  <td class="money-text">R${{ toDecimal(item.amount) }}</td>
                  <td class="money-text">{{ toDecimal(item.rebate_rate) }}%</td>
                  <td class="money-text">x1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../theme/mixin.scss";

.vip {
  padding-bottom: 150px;
  color: #fff;
  font-size: 28px;
  position: relative;

  .bg {
    width: 100%;
  }
}

.body {
  position: absolute;
  top: 110px;
  padding-top: 30px;
}

.my-swipe {
  height: 330px;
  width: 750px;
  padding-left: 20px;
  margin-bottom: 30px;

  .swipe-item {
    width: 680px;
    height: 330px;
    // background-image: url();
    background-image: v-bind(cardImg);
    @include webp("/img/vip/card.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .top {
      width: 100%;
      height: 162px;
      display: flex;
      align-items: center;
      padding-top: 31px;
      padding-left: 48px;
      margin-bottom: 8px;
      box-sizing: content-box;

      .progress-box {
        display: flex;
        align-items: center;
      }

      .progress {
        margin: 0 15px 0 22px;
      }
    }

    .bottom {
      display: flex;

      .data {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        label {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 2px;
        }

        span {
          font-size: 24px;
          color: #ffffffb2;
          text-align: center;
        }
      }
    }
  }
}

.wallet {
  margin: 0 auto;
  width: 710px;
  height: 248px;
  border-radius: 20px;
  background: linear-gradient(
    180deg,
    rgba(4, 75, 154, 0.3) 0%,
    rgba(1, 26, 81, 0.3) 100%
  );
  display: flex;
  padding-top: 40px;

  .wallet-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      margin-bottom: 24px;
      height: 51px;
    }

    label {
      font-size: 36px;
      font-weight: 700;
      height: 44px;
    }

    span {
      color: #ffffffb2;
      font-size: 24px;
      text-align: center;
    }
  }
}

.wrapper {
  padding: 30px 20px 150px;
  background-color: #000a1e;

  h6 {
    font-weight: 400;
    margin-bottom: 24px;
    margin-left: 20px;
    font-size: 28px;
  }

  .box {
    width: 710px;
    background-image: linear-gradient(to bottom, #044b9a, #011a51);
    border-radius: 20px;
    margin: 0 auto;
    height: 152px;
    padding: 30px 21px;
    box-sizing: border-box;
    margin-bottom: 30px;

    p {
      margin-bottom: 3px;
    }

    .progress {
      width: 100%;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .table-bg {
    width: 710px;
    border-radius: 20px;
    background: linear-gradient(
      180deg,
      rgba(4, 75, 154, 0.3) 0%,
      rgba(1, 26, 81, 0.3) 100%
    );
    padding: 25px;

    .table-wrapper {
      border: 1px solid #ffffff40;
      border-radius: 8px;

      table {
        width: 660px;
        border-collapse: collapse;

        tbody {
          tr {
            &:nth-of-type(odd) {
              background-color: rgba(4, 75, 154, 0.2);
            }
          }
        }

        th,
        td {
          height: 50px;
          border-right: 1px solid #ffffff40;
          text-align: center;

          &:nth-of-type(4) {
            border: none;
          }
        }

        th {
          font-weight: 400;
        }
      }
    }
  }
}
</style>

<route lang="yaml">
meta:
  auth: true
</route>
