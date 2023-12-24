<script setup lang='ts'>
const cols = [
  {
    title: 'Name <br /> do jogo',
    key: 'game_name'
  },
  {
    title: 'Tempo',
    key: 'time'
  },
  {
    title: 'Valor <br />da aposta',
    key: 'bet_amount'
  },
  {
    title: 'Lucro',
    key: 'net_amount'
  }
]

const flag = ref('1')
const flagList = [
  { label: 'Hoje', value: '1' },
  { label: 'Últimos 7 dias', value: '7' },
  { label: 'Últimos 60 dias', value: '60' },
]
const ty = ref('')
const tyList = [
  { label: 'todos os jogos', value: '' }, // 全部
  { label: 'Ao Vivo', value: '1' }, // 真人
  { label: 'Pesca', value: '2' }, // 捕鱼
  { label: 'Slot', value: '3' }, // 电子
  { label: 'Esporte', value: '4' }, // 体育
  { label: 'Pôquer', value: '5' }, // 棋牌
  { label: 'Esports', value: '6' }, // 电竞
]
const onSelect = () => {
  window.scrollTo(0, 0)
  list.value.length = 0
  finished.value = false
  page.value = 1
  runGetBetRecord()
}

const gt = ref('0')
const gtList = [
  { label: 'Todas', value: '0' },
  { label: 'ganho', value: '1' },
]

const list = ref<any[]>([])
const total = ref(0)
const finished = ref(false)
const page = ref(1)
const page_size = ref(50)
const { loading, run: runGetBetRecord } = useRequest(() => ApiGetBetRecord({ gt: gt.value, ty: ty.value, flag: flag.value, page: page.value, page_size: page_size.value }), {
  onSuccess(res) {
    if (page.value === 1) total.value = res.t

    if (res.d) {
      const arr = res.d.map((item) => {
        const time = timestamp2Date(item.bet_time)
        item.bet_amount = toDecimal(item.bet_amount)
        item.net_amount = toDecimal(item.net_amount)
        return { ...item, time }
      })
      list.value = [...list.value, ...arr]
    }

    if (list.value.length >= total.value) finished.value = true
  }
})

const loadMoreData = () => {
  page.value++
  runGetBetRecord()
}
</script>
<template>
  <div class='p-record-transaction'>
    <app-header title="Histórico de Apostas" leftArrow></app-header>
    <div class="fixedbox">
      <div class="tabbox">
        <AppTab :list-data="gtList" v-model="gt" @change="onSelect" :height="100" />
      </div>
      <div class="selectbox">
        Pesquisar
        <AppSelect @onSelect="onSelect" v-model="flag" :list-data="flagList" />
        <AppSelect @onSelect="onSelect" v-model="ty" :list-data="tyList" />
      </div>
      <div class="marginbox30"></div>
    </div>
    <div class="tablebox">
      <app-table :local="316" :data="list" :cols="cols" :loading="loading" :finished="finished"
        @loadMoreData="loadMoreData"></app-table>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.flex-sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.p-record-transaction {
  background: rgba(0, 10, 29, 1);
  min-height: 100vh;
  padding-bottom: 79px;

  .tabbox {
    background: linear-gradient(180deg, rgba(1, 26, 81, 0) 35.94%, #011A51 100%);
  }

  .fixedbox {
    background: rgba(0, 10, 29, 1);
    position: fixed;
    z-index: 11;
    width: 100%;
    top: 110px;

    .marginbox30 {
      height: 30px;
      background: rgba(217, 217, 217, 0.1);
    }
  }

  .selectbox {
    padding: 8px 24px;
    display: flex;
    align-items: center;
    gap: 0 14px;
    box-sizing: border-box;
    box-shadow: 0px -1px 0px 0px rgba(255, 255, 255, 0.1) inset;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    font-size: 24px;
  }

  .tablebox {
    padding: 315px 16px 79px 16px;
    border-radius: 20px;
    background: rgba(217, 217, 217, 0.1);
    min-height: 100vh;
  }
}
</style>

<route lang="yaml">
  meta:
    auth: true
</route>

