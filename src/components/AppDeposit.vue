<script lang="ts" setup name="DepositPage">
import { showFailToast } from "vant";
import { openLink } from "~/utils/utils";

const appStore = useAppStore();
const { isLogin, depositBonusConf, balanceDetailInfo, depositTy } =
  storeToRefs(appStore);

const { data: channelsConf } = useRequest(
  () => ApiGetDepositChannel({ flag: "1" }),
  {
    ready: isLogin,
    onError: () => {},
    onSuccess: (data) => {
      if (data) {
        curChannelId.value = data.d[0].fid;
      }
    },
  }
);
const curChannelId = ref("");
const channelsList = computed(() => channelsConf.value?.d ?? []);
const curChannel = computed(() => {
  if (channelsConf.value) {
    return channelsConf.value.d.filter((i) => i.fid === curChannelId.value)[0];
  }
});
const placeholderText = computed(() => {
  if (curChannel.value) {
    return `(${curChannel.value.fmin}-${curChannel.value.fmax})`;
  }
  return "";
});

// 快捷金额
const amountList = computed(
  () => curChannel.value?.amount_list.split(",") ?? []
);
// 奖金比例
const bonusPercent = computed(() => {
  if (depositBonusConf.value && depositBonusConf.value[0].ty === 1) {
    // 首存
    return depositBonusConf.value[0].bonus / 100;
  } else if (depositBonusConf.value && depositBonusConf.value[0].ty === 2) {
    if (depositAmount.value === "")
      return depositBonusConf.value[0].bonus / 100;
    // 次存
    const a =
      depositBonusConf.value.find(
        (config) =>
          +depositAmount.value >= config.min_amount &&
          +depositAmount.value <= config.max_amount
      )?.bonus ?? 0;
    return a === 0 ? 0 : a / 100;
  }
  return 0;
});
// 最小奖金存款额度
const minDepositForBonus = computed(() =>
  depositBonusConf.value ? depositBonusConf.value[0].min_amount : 0
);
// 获取赠送奖金
const getBounus = (a: string) => {
  const value = +a * bonusPercent.value;
  return toDecimal(value);
};
const quickClick = (a: string) => {
  depositAmount.value = a;
};

const currentBonusIndex = ref(0);
const curentBonus = computed(() =>
  depositBonusConf.value ? depositBonusConf.value[0].bonus : 0
);
const bonusOptions = computed(() => {
  const arr = [
    {
      id: "1",
      label: `${curentBonus.value}% ${
        depositTy.value === 1 ? "primeiro depósito" : "de novo depósito"
      }`,
    },
    { id: "2", label: "não participe de atividades" },
  ];
  if (
    depositAmount.value !== "" &&
    +depositAmount.value < minDepositForBonus.value
  ) {
    arr.shift();
  }

  return arr;
});

const depositAmount = ref("");
const InputBonus = computed(() => {
  if (+depositAmount.value < minDepositForBonus.value) return "";
  return getBounus(depositAmount.value);
});

const { run: postDeposit } = useRequest(ApiDoDeposit, {
  manual: true,
  onError: () => {},
  onSuccess: (data: any) => {
    if (data && data.addr) {
      openLink(data.addr);
    }
  },
  onAfter: () => {
    appStore.runGetMemberInfo();
  },
});

const doDeposit = () => {
  if (curChannel.value) {
    if (
      +depositAmount.value < +curChannel.value.fmin ||
      (+curChannel.value.fmax > 0 &&
        +depositAmount.value > +curChannel.value.fmax)
    ) {
      showFailToast("O valor mínimo de saque é R$ 50");
      return;
    }
    if (isLogin.value && +depositAmount.value > 0) {
      postDeposit({
        fid: curChannel.value.fid,
        amount: depositAmount.value,
        flag: bonusOptions.value[currentBonusIndex.value].id,
      });
    } else {
      showFailToast("Por favor, insira o valor");
    }
  }
};
</script>

<template>
  <div v-if="channelsConf && curChannel" class="content-deposit">
    <!-- <div class="warn-desc">
      Prezado usuário, quando o valor da primeira recarga for maior que 50
      reais, você receberá no máximo 20% de recompensa de recarga, e quando o
      valor da recarga for maior que 50 reais, você receberá no máximo 10% de
      recompensa de recarga! 6 vezes ao dia, quanto maior o valor da recarga,
      maior a proporção de presentes!!
    </div> -->

    <div class="choose-pay">
      <p>Escolha o metodo de pagamento</p>
      <div
        class="pay-type"
        v-for="c in channelsList"
        :key="c.fid"
        @click="curChannelId = c.fid"
      >
        <AppImage
          class="i-radio"
          :src="`/icons/i-radio-${
            curChannelId === c.fid ? 'active' : 'no'
          }.png`"
          alt=""
        />
        <span>{{ c.show_name }}</span>
      </div>
    </div>

    <div class="dollar-input">
      <div v-if="+InputBonus > 0" class="m-tag-input">+{{ InputBonus }}</div>
      <AppInput
        v-model="depositAmount"
        plain
        :placeholder="placeholderText"
        type="number"
        width="auto"
        :pattern="/^[0-9]+$/"
        msg=""
        :style-obj="{ fontSize: 'var(--app-px-28)' }"
        :min="+curChannel.fmin || 0"
        :max="+curChannel.fmax || undefined"
      />
    </div>

    <ul class="quick-money">
      <li
        class="item"
        v-for="amount in amountList"
        :class="{ active: +depositAmount === +amount }"
        :key="amount"
        @click="() => quickClick(amount)"
      >
        <div><span class="label">R$</span>{{ amount }}</div>
        <div class="m-tag" v-show="+amount >= minDepositForBonus">
          +{{ getBounus(amount) }}
        </div>
      </li>
    </ul>

    <div class="bonus">
      <p>Atividade</p>
      <div class="bonus-list">
        <div
          class="bonus-item"
          v-for="(b, i) in bonusOptions"
          :key="b.id"
          @click="currentBonusIndex = i"
        >
          <AppImage
            class="i-radio"
            :src="`/icons/i-radio-${
              currentBonusIndex === i ? 'active' : 'no'
            }.png`"
            alt=""
          />
          <span>{{ b.label }}</span>
        </div>
      </div>
    </div>

    <div class="show-rate" v-show="curChannel && curChannel.ty === 2">
      <h6 class="title">Bônus de depósito</h6>
      <p>
        Taxa de cambio de referencia 1 USDT={{ curChannel.pay_rate }}BRL<br />
        Ir para Minhas chaves<br />
        <span class="blue">R${{ toDecimal(balanceDetailInfo?.brl ?? 0) }}</span>
        em sua conta particular
      </p>
    </div>

    <AppButton
      fontSize="28"
      radius="45"
      bold
      whiteText
      blueToRight
      width="580"
      height="90"
      center
      @click="doDeposit"
    >
      Depósito
    </AppButton>
  </div>
</template>

<style lang="scss" scoped>
.i-radio {
  display: block;
  object-fit: cover;
  width: 32px;
  height: 32px;
  margin-right: 20px;
}

.m-tag {
  position: absolute;
  padding: 0 10px;
  line-height: 30px;
  top: 0;
  right: 0;
  border-radius: 0px 8px;
  background: linear-gradient(139deg, #ff4e05 0%, #ff995a 100%), #d9d9d9;
  color: #fff;
  text-align: center;
  text-shadow: 0px 4px 4px #ff0202;
  font-size: 24px;
  transform: scale(0.75);
  transform-origin: top right;
}

.m-tag-input {
  position: absolute;
  padding: 0 10px;
  line-height: 30px;
  top: 0;
  right: 0;
  border-radius: 0px 8px;
  background: linear-gradient(139deg, #ff4e05 0%, #ff995a 100%), #d9d9d9;
  color: #fff;
  text-align: center;
  text-shadow: 0px 4px 4px #ff0202;
  font-size: 24px;
}

.content-deposit {
  .warn-desc {
    width: 686px;
    height: 218px;
    margin: 30px auto 30px;
    color: #f7ba17;
    text-align: center;
    font-size: 24px;
    line-height: 34px;
    background: linear-gradient(
      90deg,
      rgba(247, 186, 23, 0) 0%,
      rgba(247, 186, 23, 0.16) 51.56%,
      rgba(247, 186, 23, 0) 100%
    );
  }

  .choose-pay {
    padding: 0 20px;
    &:first-child{
      padding-top: 16px;
    }
    p {
      color: #0ed1f4;
      font-size: 32px;
      margin-bottom: 16px;
    }

    .pay-type {
      width: 710px;
      height: 88px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 28px;
      color: #fff;
      display: flex;
      align-items: center;
      padding-left: 24px;
      margin-bottom: 16px;
      background: linear-gradient(0deg, #011a51 0%, #011a51 100%), #2a2e3e;
    }
  }

  .bonus {
    padding: 0 20px;
    margin-bottom: 44px;

    p {
      color: #0ed1f4;
      font-size: 32px;
      margin-bottom: 16px;
    }

    .bonus-list {
      width: 710px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 29px 24px;
      background: linear-gradient(0deg, #011a51 0%, #011a51 100%), #2a2e3e;

      .bonus-item {
        font-size: 28px;
        color: #fff;
        display: flex;
        align-items: center;
        margin-bottom: 53px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }

  .dollar-input {
    position: relative;
    width: 710px;
    height: 72px;
    padding: 0 24px;
    margin: 30px auto 24px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(0deg, #011a51 0%, #011a51 100%), #2a2e3e;
  }

  ul.quick-money {
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(4, 168px);
    grid-template-rows: auto;
    grid-gap: 11px;
    margin-bottom: 30px;

    li.item {
      position: relative;
      border-radius: 8px;
      background: linear-gradient(0deg, #011a51 0%, #011a51 100%), #2a2e3e;
      width: 168px;
      height: 74px;
      line-height: 74px;
      color: #fff;
      text-align: center;
      font-size: 28px;

      .label {
        padding-right: 14px;
      }

      &.active {
        background: linear-gradient(358deg, #1373ef 0%, #0ed1f4 100%),
          linear-gradient(0deg, #011a51 0%, #011a51 100%), #2a2e3e;
      }
    }
  }

  .show-rate {
    margin: 44px auto;
    padding: 0 24px;

    .title {
      font-size: 28px;
      color: #fff;
      margin-bottom: 5px;
    }

    p {
      font-size: 24px;
      color: #ffffff99;
      line-height: 46px;
    }

    .blue {
      color: #0ed1f4;
      font-weight: 700;
    }
  }
}
</style>
