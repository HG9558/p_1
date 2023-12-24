<script lang="ts" setup name="FinancePage">
import { showConfirmDialog } from 'vant';
const router = useRouter()

const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const balance = computed(() => toDecimal(userInfo.value.brl ?? 0))
const withdrawBalance = computed(() => toDecimal(userInfo.value.brl_amount ?? 0))
const deposit_amount = computed(() => toDecimal(userInfo.value.deposit_amount ?? 0))
const deposit_balance = computed(() => toDecimal(userInfo.value.deposit_balance ?? 0))
const agencyAmount = computed(() => toDecimal(userInfo.value.agencyAmount ?? 0))
const agency_balance = computed(() => toDecimal(userInfo.value.agency_balance ?? 0))

const tabs = [
  { label: 'Depósito', value: '1' },
  { label: 'Retirar', value: '2' },
]
const activeTab = ref(router.currentRoute.value.query.tab === 'withdraw' ? '2' : '1')

const showPopoverOne = ref(false)
const showPopoverTwo = ref(false)

watch(activeTab, (val) => {
  if (val === '2') {
    if (userInfo.value && userInfo.value.pay_password && +userInfo.value.pay_password !== 1) {
      payPwdTip.value = true
    }
  }
})

const payPwdTip = ref(false)

const goPayPwd = () => {
  router.push('/safe-center/bind-pay-pwd')
}
const show = ref(false)
const amount = ref('')
const submit = () => {
  showConfirmDialog({
    title: 'Transferir',
    message: `Por favor, confirme o valor da transferência ${amount.value} BRL`,
    cancelButtonText: "Cancelar",
    confirmButtonText: "confirme",
    className:"lb-dialog"
  }).then(() => {
    // on confirm
    confirm()
  })
    .catch(() => {
    })
}
const cancel = ()=>{
  amount.value = ''
}
const { run: confirm, } = useRequest(() => ApiWalletTransfer({ amount: +amount.value }), {
  manual: true,
  onSuccess: (data) => {
    show.value = false
    cancel()
    showToast('Transferência bem sucedida')
    appStore.runGetUserBalance()
  },
});

</script>

<template>
  <div class="finance-page">
    <AppHeader title="Conta" left-arrow />
    <section class="content">
      <div class="money-info">
        <div class="bar">
          <div class="tag">Total Da Conta</div>
          <ul class="">
            <li>
              <div><span>R$</span>{{ balance }}</div>
              <span class="desc">Fundos totais</span>
            </li>
            <li>
              <div><span>R$</span>{{ withdrawBalance }}</div>
              <span class="desc">Retirável Total</span>
            </li>
          </ul>
        </div>
        <ul class="detail">
          <van-popover class="warning-popover" v-model:show="showPopoverOne" placement="top-start">
            <div class="small-white-txt">Uma conta que consiste no valor da recarga, recompensas pela participação em
              atividades, vitórias e derrotas no jogo, etc.</div>
            <template #reference>
              <li>
                <div><span>Depositar conta</span>
                  <AppImage src="/icons/i-why.png" />
                </div>
                <div><span>Balanço: </span>{{ deposit_amount }}
                </div>
                <div><span>Retirável: </span>{{ deposit_balance }}
                </div>
              </li>
            </template>
          </van-popover>
          <van-popover class="warning-popover" v-model:show="showPopoverTwo" placement="top-end">
            <div class="small-white-txt">Uma conta composta por recompensas por convidar amigos e retorno de comissões com
              base no valor da transação dos usuários convidados.</div>
            <template #reference>
              <li>
                <div><span>Conta Promovida</span>
                  <AppImage src="/icons/i-why.png" />
                </div>
                <div><span>Balanço: </span>{{ agencyAmount }}</div>
                <div><span>Retirável: </span>{{ agency_balance }}
                </div>
              </li>
            </template>
          </van-popover>
        </ul>
        <div class="tran-wrap">
          <van-button :loading="false" type="primary" icon="exchange" size="mini" @click="show = true">Alterar carteira</van-button>
        </div>

      </div>
      <section class="fin">
        <div class="fin-tab">
          <AppTab :list-data="tabs" v-model="activeTab" />
        </div>

        <ul class="fin-inner">
          <li v-if="activeTab === '1'">
            <AppDeposit />
          </li>

          <li v-if="activeTab === '2'">
            <AppWithdraw />
          </li>
        </ul>
      </section>
    </section>

    <van-popup class="" v-model:show="payPwdTip" teleport="body" round>
      <div class="tip-content">
        <div class="text">
          A senha de pagamento ainda não foi definida, por favor, defina-a primeiro
        </div>
        <div class="btns">
          <div class="cancel" @click="payPwdTip = false">Cancelar</div>
          <AppButton @click="goPayPwd" width="280" height="90" bold blue-to-right :radius="45" white-text>
            Confirme
          </AppButton>
        </div>
      </div>
    </van-popup>
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper">
        <div class="bg-w" @click.stop>
          <div class="title">Transferir dinheiro BRL</div>
          <AppInput v-model="amount" :width="480" :pattern="amountReg" type="number" min="1" icon-left="i-bet-record"
            placeholder="Quantia" msg="Error Quantia" />
          <div style="margin: 16px;">
            <van-button round block :disabled="!(amount.length > 0)" type="primary" @click="submit" native-type="submit">
              Entrar
            </van-button>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style lang="scss" scoped>
.tip-content {
  width: 634px;
  border-radius: 20px;
  background: #011A51;
  padding-top: 48px;

  .text {
    color: #FFF;
    text-align: center;
    font-size: 26px;
    font-weight: 400;
    line-height: 40px;
    padding: 0 66px;
  }

  .btns {
    padding-top: 48px;
    padding-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;

    .cancel {
      width: 280px;
      height: 90px;
      line-height: 90px;
      color: #FFF;
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      border-radius: 100px;
      background: #044B9A;
      cursor: pointer;
    }
  }
}

.finance-page {
  background: #061531;
  min-height: 100vh;
  padding-top: 110px;
  padding-bottom: 132px;

  .money-info {
    width: 710px;
    height: 360px;
    margin: 30px 20px 0;
    color: #fff;
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(4, 75, 154, 0.30) 0%, rgba(1, 26, 81, 0.30) 100%);

    .bar {
      height: 192px;
      border-radius: 20px;
      background: linear-gradient(360deg, #044B9A 0%, #1373EF 53.65%, #0ED1F4 100%), linear-gradient(144deg, #466AC5 0%, #46B5FB 100%);
      box-shadow: 0px -16px 34px 0px #49B5FF inset;
      position: relative;

      .tag {
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 42px;
        line-height: 42px;
        border-radius: 20px 0px;
        background: rgba(0, 0, 0, 0.10);
        color: #FFF;
        text-align: center;
        font-size: 24px;
      }

      ul {
        list-style: none;
        color: #FFF;
        font-size: 42px;
        font-weight: 700;
        display: flex;
        text-align: center;
        align-items: center;

        li {
          width: 50%;
          padding-top: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .desc {
            color: rgba(255, 255, 255, 0.70);
            font-size: 24px;
            padding-top: 17px;
            font-weight: normal;
          }
        }
      }
    }

    .detail {
      color: #FFF;
      font-size: 26px;
      line-height: 30px;
      display: flex;
      padding-top: 20px;

      li {
        // width: 50%;
        padding-left: 20px;

        >div:nth-child(2) {
          padding-top: 16px;
          padding-bottom: 16px;
        }

        >div:first-child {
          line-height: 28px;
          color: rgba(255, 255, 255, 0.70);
          font-size: 24px;

          img {
            width: 24px;
            margin-left: 6px;
          }
        }
      }
    }

  }

  .fin {
    .fin-tab {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 110px;
      background: linear-gradient(180deg, rgba(1, 26, 81, 0.00) 35.94%, #011A51 100%);
      box-shadow: 0px -1px 0px 0px rgba(255, 255, 255, 0.10) inset, 0px 4px 5px 0px rgba(0, 0, 0, 0.30);
    }

    ul.fin-inner {

      li.content-withdraw {
        padding: 32px 20px 88px;
      }
    }
  }
  .tran-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    margin-right: 80px;
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .bg-w {
    padding: 16px;
    width: 600px;
    height: 320px;
    background-color: #011A51;
    border-radius: 16px;
    .title {
      text-align: center;
      font-size: 32px;
      height: 60px;
      line-height: 60px;
      color: #fff;
      margin-bottom: 12px;
    }
    .app-input-outer{
      display: flex;
      justify-content: center;
    }
  }
}
</style>
<style>
.lb-dialog{
  background-color: #011A51;
  .van-dialog__message,.van-dialog__header{
    color: #fff;
  }
  .van-dialog__footer{
    .van-button{
      background-color: #011A51;
      color: #fff;
      border: 0;
    }
    
  }
}
</style>
<route lang="yaml">
  meta:
    auth: true
</route>
