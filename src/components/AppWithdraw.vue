<script lang="ts" setup name="WithdrawPage">
import { showFailToast } from "vant";

const router = useRouter();
const appStore = useAppStore();
const { isLogin, balanceDetailInfo, userBanks,userInfo } = storeToRefs(appStore);

const amount = ref("");
const amountRef = ref();
const vipLevel = computed(() => userInfo.value.vip ?? '0')
const currentTypeId = ref(0);
const withdrawTypeList = computed(() => {
  if (userBanks.value.length > 0) {
    return userBanks.value.map((item, index) => {
      return { ...item, index };
    });
  }
  return [];
});
const bank_id = computed(() => {
  if (withdrawTypeList.value.length > 0) {
    return withdrawTypeList.value.find((a) => a.index === currentTypeId.value)
      ?.id;
  }
  return "";
});

const { data: vipList } = useRequest(ApiGetMemberVip)
const limit_amount = computed(()=>{
  return vipList.value?.find(vipitem=>vipitem.vip == +vipLevel.value)?.withdraw_limit || 0
})
// const conf = computed(() => {
//   if (withdrawConf.value && withdrawConf.value.config) {
//     const temp = withdrawConf.value.config;
//     console.log(temp, "temp", withdrawConf.value);
//     return {
//       ...temp,
//       fmin: +temp.fmin || 0,
//       fmax: +temp.fmax || 0,
//     };
//   }
//   return { fmin: 0, fmax: 0 };
// });

const { run: postWithdraw } = useRequest(
  () =>
    ApiPostWithdraw({
      fid: curChannel.value?.fid || "",
      amount: amount.value,
      bank_id: bank_id.value,
    }),
  {
    manual: true,
    onError: () => {},
    onSuccess: () => {
      amount.value = "";
      currentTypeId.value = 0;
      appStore.runGetUserBalance();
      showToast({ type: "success", message: "Retirada bem-sucedida" });
    },
  }
);

const { run: runGetWithdrawFee, data: feeTip } = useRequest(ApiWithdrawFee, {
  manual: true,
  debounceInterval: 1000,
  onSuccess: (data) => {
    console.log(data);
  },
});

watchEffect(async () => {
  const val = amount.value;
  if (val && +val > 0) {
    const withdrawTotal = balanceDetailInfo.value
      ? balanceDetailInfo.value.brl_amount
      : 0;
    if (+val > withdrawTotal) {
      return;
    }
    if (+(curChannel.value?.fmin || 0) >= 0) {
      if (+val < +(curChannel.value?.fmin || 0)) {
        return;
      }
    }
    if (+(curChannel.value?.fmax || 0) >= 0) {
      if (+val > +(curChannel.value?.fmax || 0)) {
        return;
      }
    }

    // onCleanup(cancelReqFee)
    runGetWithdrawFee({ amount: val });
  }
});

const doWthdraw = () => {
  const withdrawTotal = balanceDetailInfo.value
    ? balanceDetailInfo.value.brl_amount
    : 0;
  if (+amount.value > withdrawTotal) {
    showFailToast(
      "O valor da retirada não pode ser maior que o valor da retirada da conta"
    );
    return;
  }
  amountRef.value.validation();
  console.log(curChannel.value, "curChannel.value");
  if (+(curChannel.value?.fmin || 0) >= 0) {
    if (+amount.value < +(curChannel.value?.fmin || 0)) {
      showFailToast("O valor mínimo de saque é R$ 50");
      return;
    }
  }
  if (+(curChannel.value?.fmax || 0) >= 0) {
    if (+amount.value > +(curChannel.value?.fmax || 0)) {
      showFailToast("O valor mínimo de saque é R$ 50");
      return;
    }
  }
  if (amountRef.value.isValid) {
    postWithdraw();
  }
};

const { data: channelsConf } = useRequest(
  () => ApiGetDepositChannel({ flag: "2" }),
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

const msg = computed(() => {
  return +(curChannel.value?.fmax || 0) > 0
    ? `Valor da retirada (${+(curChannel.value?.fmin || 0)} - ${+(
        curChannel.value?.fmax || 0
      )})`
    : "Valor da retirada " + +(curChannel.value?.fmin || 0);
});
</script>

<template>
  <div class="content-withdraw">
    <div class="warn-desc">
      Uma conta só pode ser vinculada a um número de CPF para saque, uma vez
      vinculada não pode ser alterada.
      <div class="conter-text">Atualmente <span class="text-red">VIP{{ vipLevel }}</span>, o valor mínimo de saque diário é de <span class="text-red">R$50</span> e o valor máximo de saque é de <span class="text-red">R${{ limit_amount }}</span>.</div>
    </div>

    <div class="choose-pay">
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

    <div class="info-bar">
      <label class="amount-text">Valor da retirada</label>

      <AppInput
        ref="amountRef"
        v-model="amount"
        plain
        width="460"
        :placeholder="'Retirada mínima R$' + curChannel?.fmin"
        :msg="msg"
        type="number"
        required
        :min="curChannel?.fmin"
        :max="+(curChannel?.fmax || 0) > 0 ? curChannel?.fmax : undefined"
      />
    </div>
    <div v-if="feeTip && +feeTip > 0" class="warn-desc">
      Taxa de manuseio {{ feeTip }} reais.
    </div>
    <div v-if="withdrawTypeList.length > 0" class="choose-pay">
      <p>Escolha o metodo de pagamento</p>

      <div
        class="pay-type"
        v-for="t in withdrawTypeList"
        :key="t.id"
        @click="currentTypeId = t.index"
      >
        <AppImage
          class="i-radio"
          :src="`/icons/i-radio-${
            currentTypeId === t.index ? 'active' : 'no'
          }.png`"
          alt=""
        />
        <span>{{ t.pix_id }}</span>
      </div>
    </div>
    <div v-else class="no-card">
      <p>Para vincular cartão de banco</p>
      <AppButton
        width="132"
        height="48"
        white-text
        round
        blue-to-right
        font-size="28"
        @click="router.push('/safe-center/banks')"
        >Retirar</AppButton
      >
    </div>

    <div class="btn-box">
      <AppButton
        :disabled="withdrawTypeList.length === 0"
        fontSize="28"
        radius="45"
        bold
        whiteText
        blueToRight
        width="580"
        height="90"
        center
        @click="doWthdraw"
      >
        Retirar
      </AppButton>
    </div>

    <div class="withdraw-desc">
      <h3>Regras de retirada</h3>
      <p>
        1. O valor e a frequência do saque diário estão diretamente relacionados
        ao seu nível VIP.
      </p>
      <p>
        2. O valor da retirada deve ser em múltiplos de 10. Por exemplo: 10, 20,
        80, 120, 990, 19820…
      </p>
      <p>3. As recompensas da promoção podem ser retiradas diretamente.</p>
      <p>
        4. O saldo não retirável na conta de recarga (Atividade) (incluindo,
        entre outros, o valor da recarga, recompensas por participar de
        atividades e valor de ganhos e perdas do jogo, etc.).
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn-box {
  padding-bottom: 54px;
  padding-top: 6px;
}

.i-radio {
  display: block;
  object-fit: cover;
  width: 32px;
  height: 32px;
  margin-right: 20px;
}

.mb-34 {
  margin-bottom: 34px;
}

.content-withdraw {
  padding: 0 20px 88px;
}

.warn-desc {
  margin: 36px 0 30px;
  width: 686px;
  color: #fff;
  text-align: center;
  font-size: 20px;
  line-height: 34px;
  background: linear-gradient(
    90deg,
    rgba(247, 186, 23, 0) 0%,
    rgba(247, 186, 23, 0.16) 51.56%,
    rgba(247, 186, 23, 0) 100%
  );
  .conter-text{
  color: #f7ba17;
    font-size: 25px;
    .text-red{
      color: #fb0d09;
    }
  }
}

.info-bar {
  width: 710px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(0deg, #011a51 0%, #011a51 100%), #2a2e3e;
  line-height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 24px;
  position: relative;

  .amount-text {
    color: #fff;
    font-size: 28px;
    position: absolute;
    right: 21px;
  }
}

.no-card {
  margin: 30px auto;
  display: flex;
  justify-content: space-between;

  p {
    color: #0ed1f4;
    font-size: 32px;
    margin-bottom: 17px;
  }
}

.choose-pay {
  margin: 30px auto;

  p {
    color: #0ed1f4;
    font-size: 32px;
    margin-bottom: 17px;
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

.withdraw-desc {
  h3 {
    color: #f7ba17;
    text-align: center;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 22px;
  }

  p {
    color: #fff;
    font-size: 26px;
    font-weight: 400;
    line-height: 30px;
    padding-bottom: 20px;
  }
}
</style>
