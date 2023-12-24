<script setup lang='ts' name='invite-daily'>
const router = useRouter()
const { isApp } = storeToRefs(useAppStore())

const goRecompensas = () => {
  if (isApp.value) return window.open('brazilapp://event?type=recompensas')

  router.push('/record-list/recompensas')
}

const showTip1 = ref(false)
const showTip2 = ref(false)
const tabList = [
  { label: 'Equipe Nível 1', value: '1' },
  { label: 'Equipe Nível 2', value: '2' },
  { label: 'Equipe Nível 3', value: '3' },
]

const type1 = ref('1')
const { data: totalData } = useRequest(ApiGetInviteReportTotal)
const totalAmount = computed(() => totalData.value?.total_amount ?? 0)
const settledAmount = computed(() => totalData.value?.settled_amount ?? 0)
const pendingAmount = computed(() => totalData.value?.pending_amount ?? 0)
const totalData1 = computed(() => {
  const obj = {
    id: '',
    mem_count: 0,
    deposit_mem_count: 0,
    first_deposit_bonus: 0,
    valid_bet_amount: 0,
    rebate_amount: 0,
    total_amount: 0,
    ty: 0,
    report_time: 0,
    lvl: '',
    uid: '',
    username: '',
  }
  if (type1.value === '1') return totalData.value?.lvl_one ?? obj
  if (type1.value === '2') return totalData.value?.lvl_two ?? obj
  if (type1.value === '3') return totalData.value?.lvl_three ?? obj
  return obj
})

const type2 = ref('1')
const showDatePicker = ref(false)
const currentDate = ref(dayjs().format('YYYY/MM/DD'))
const onConfirm = (data: any) => {
  currentDate.value = data
  runGetInviteRepostList()
}
const { data: totalDataByDay, run: runGetInviteRepostList } = useRequest(() => ApiGetInviteReport({
  lvl: type2.value,
  page: 1,
  page_size: 500,
  start_time: `${currentDate.value.replace(/\//g, '-')} 00:00:00`,
  end_time: `${currentDate.value.replace(/\//g, '-')} 23:59:59`
}))
const totalData2 = computed(() => {
  const obj = {
    mem_count: 0,
    deposit_mem_count: 0,
    first_deposit_bonus: 0,
    valid_bet_amount: 0,
    rebate_amount: 0,
    total_amount: 0
  }
  if (totalDataByDay.value && totalDataByDay.value.d) {
    return totalDataByDay.value.d.reduce((pre, cur) => {
      pre.mem_count += cur.mem_count
      pre.deposit_mem_count += cur.deposit_mem_count
      pre.first_deposit_bonus += cur.first_deposit_bonus
      pre.valid_bet_amount += cur.valid_bet_amount
      pre.rebate_amount += cur.rebate_amount
      pre.total_amount += cur.total_amount

      return pre
    }, {
      mem_count: 0,
      deposit_mem_count: 0,
      first_deposit_bonus: 0,
      valid_bet_amount: 0,
      rebate_amount: 0,
      total_amount: 0
    })
  }

  return obj
})
</script>
<template>
  <div class="invite-daily">
    <div class="bonus-box">
      <div class="top">
        <div class="total">
          <span class="amount">R${{ toDecimal(totalAmount) }}</span>
          <span class="comment">Prêmio total</span>
        </div>
        <div class="settled" @click="goRecompensas">
          <div class="box">
            <span class="amount">R${{ toDecimal(settledAmount) }}</span>
            <AppImage src="/icons/i-round-arrowr.png" alt="" />
          </div>
          <span class="comment">Bônus já liquidados</span>
        </div>
      </div>
      <div class="bottom">
        <span class="amount">R${{ toDecimal(pendingAmount) }}</span>
        <span class="comment">Bônus aguardando liquidação (Atualizar a cada 6 horas)</span>
      </div>
    </div>

    <!-- data1 -->
    <h5>
      <label>Dados totais</label>
      <span class="comment">(Atualize a cada 30 minutos)</span>
    </h5>
    <AppRoundTab v-model="type1" :list="tabList" width="700" />
    <div class="data-box">
      <!-- 总人数 -->
      <div class="data-row">
        <div class="data-item">
          <span class="amount">{{ totalData1.mem_count }}</span>
          <span class="comment">Total de pessoas</span>
        </div>
        <div class="data-item">
          <span class="amount">R${{ toDecimal(totalData1.total_amount) }}</span>
          <span class="comment">Obter bônus</span>
        </div>
      </div>
      <!-- 充值人数 -->
      <div class="data-row" v-show="type1 === '1'">
        <div class="data-item">
          <span class="amount">{{ totalData1.deposit_mem_count }}</span>
          <span class="comment">Usuário de recarga</span>
        </div>
        <div class="data-item">
          <span class="amount">R${{ toDecimal(totalData1.first_deposit_bonus) }}</span>
          <span class="comment">Obter bônus</span>
        </div>
      </div>
      <!-- 总投注额 -->
      <div class="data-row">
        <div class="data-item">
          <span class="amount">{{ totalData1.valid_bet_amount }}</span>
          <span class="comment">Valor da transação do jogo</span>
        </div>
        <div class="data-item">
          <div class="flex">
            <span class="amount">R${{ toDecimal(totalData1.rebate_amount) }}</span>
            <van-popover v-model:show="showTip1" placement="top-end">
              <p class="tip">As recompensas são liquidadas toda segunda-feira</p>
              <template #reference>
                <AppImage src="/icons/i-why.png" alt="" />
              </template>
            </van-popover>
          </div>
          <span class="comment">Obter bônus</span>
        </div>
      </div>
    </div>

    <!-- data2 -->
    <h5>
      <label>Dados totais</label>
      <span class="comment">(Atualize a cada 30 minutos)</span>
    </h5>
    <AppRoundTab v-model="type2" :list="tabList" width="700" @change="runGetInviteRepostList" />
    <div class="data-box">
      <div class="date" @click="showDatePicker = true">
        <AppImage src="/icons/i-date.png" alt="" />
        <span>{{ currentDate }}</span>
      </div>
      <!-- 总人数 -->
      <div class="data-row">
        <div class="data-item">
          <span class="amount">{{ totalData2.mem_count }}</span>
          <span class="comment">Total de pessoas</span>
        </div>
        <div class="data-item">
          <span class="amount">R${{ toDecimal(totalData2.total_amount) }}</span>
          <span class="comment">Obter bônus</span>
        </div>
      </div>
      <!-- 充值人数 -->
      <div class="data-row" v-show="type2 === '1'">
        <div class="data-item">
          <span class="amount">{{ totalData2.deposit_mem_count }}</span>
          <span class="comment">Usuário de recarga</span>
        </div>
        <div class="data-item">
          <span class="amount">R${{ toDecimal(totalData2.first_deposit_bonus) }}</span>
          <span class="comment">Obter bônus</span>
        </div>
      </div>
      <!-- 总投注额 -->
      <div class="data-row">
        <div class="data-item">
          <span class="amount">{{ totalData2.valid_bet_amount }}</span>
          <span class="comment">Valor da transação do jogo</span>
        </div>
        <div class="data-item">
          <div class="flex">
            <span class="amount">R${{ toDecimal(totalData2.rebate_amount) }}</span>
            <van-popover v-model:show="showTip2" placement="top-end">
              <p class="tip">As recompensas são liquidadas toda segunda-feira</p>
              <template #reference>
                <AppImage src="/icons/i-why.png" alt="" />
              </template>
            </van-popover>
          </div>
          <span class="comment">Obter bônus</span>
        </div>
      </div>
    </div>

    <!-- date picker -->
    <AppDatePicker v-model="showDatePicker" :initialDate="currentDate" @confirm="onConfirm" />
  </div>
</template>

<style lang='scss' scoped>
.invite-daily {
  padding: 133px 20px 150px;
}

.flex {
  display: flex;
  align-items: center;
}

.comment {
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
}

.tip {
  color: #fff;
  background-color: #f7ba17;
  font-size: 24px;
  width: 540px;
  padding: 10px 20px;
}

.bonus-box {
  width: 710px;
  height: 232px;
  border-radius: 20px;
  background: linear-gradient(360deg, #044B9A 0%, #1373EF 53.65%, #0ED1F4 100%), linear-gradient(144deg, #466AC5 0%, #46B5FB 100%);
  box-shadow: 0px -16px 34px 0px #49B5FF inset;
  margin-bottom: 32px;

  .top {
    display: flex;
    height: 50%;
    align-items: center;

    .total,
    .settled {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .box {
        @extend .flex;

        span {
          margin-right: 9px;
        }

        img {
          width: 27px;
        }
      }
    }
  }

  .bottom {
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .amount {
    font-size: 42px;
    font-weight: 700;
  }
}

h5 {
  font-size: 28px;
  font-weight: 700;
  color: #0ED1F4;
  margin-bottom: 13px;

  label {
    margin-right: 15px;
  }
}

.data-box {
  width: 100%;
  padding-top: 10px;
  margin-bottom: 50px;

  .data-row {
    width: 100%;
    height: 102px;
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);

    .data-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .amount {
        color: #0ED1F4;
        font-size: 28px;
        font-weight: 700;
      }

      img {
        width: 24px;
        margin-left: 7px;
      }
    }
  }

  .date {
    width: 192px;
    height: 60px;
    border-radius: 8px;
    border: 1px solid #0ED1F4;
    color: #0ED1F4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-top: 7px;

    img {
      width: 21px;
      margin-right: 10px;
    }
  }
}
</style>
<style>
:root {
  --van-popover-light-background: #f7ba17;
}

.van-popover[data-popper-placement=top-end] .van-popover__arrow {
  right: 16px;
}
</style>
