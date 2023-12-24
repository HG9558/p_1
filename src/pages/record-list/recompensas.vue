<script setup lang='ts'>
const flag = ref('1')
const flagList = [
  { label: 'Hoje', value: '1' },
  { label: 'Últimos 7 dias', value: '7' },
  { label: 'Últimos 60 dias', value: '60' },
]
const ty = ref('0')
const tyList = [
  { label: 'Todos', value: '0' }, // 全部
  { label: 'depositar', value: '6' }, // 存款优惠
  { label: 'entrar', value: '305' }, // 邀请奖励
  { label: 'sokoban', value: '307' }, // 宝箱奖励
]
const onSelect = () => {
  window.scrollTo(0, 0)
  list.value.length = 0
  finished.value = false
  page.value = 1
  runGetBetRecord()
}

const list = ref<any[]>([])
const total = ref(0)
const finished = ref(false)
const page = ref(1)
const page_size = ref(50)
const { loading, run: runGetBetRecord } = useRequest(() => ApiGetBonusRecord({ ty: ty.value, flag: flag.value, page: page.value, page_size: page_size.value }), {
  onSuccess(res) {
    if (page.value === 1) total.value = res.t

    if (res.d) {
      const arr = res.d.map((item) => {
        const time = timestamp2Date(item.created_at)
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
  <div class='p-record-recompensas'>
    <app-header title="Histórico de recompensas" :fixed="true" :placeholder="true" leftArrow></app-header>
    <div class="selectbox">
      <AppSelect :width="336" v-model="flag" :list-data="flagList" @onSelect="onSelect" />
      <AppSelect :width="336" v-model="ty" :list-data="tyList" @onSelect="onSelect" />
    </div>
    <div class="listbox">
      <AppList :loading="loading" :finished="finished" @loadMoreData="loadMoreData" v-if="list.length > 0">
        <div class="list-item" v-for="(item, index) in list" :key="index">
          <div>{{ toDecimal(item.amount) }}</div>
          <div>{{ item.remark }}</div>
          <div>{{ item.time }}</div>
        </div>
      </AppList>
      <app-empty v-else />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.p-record-recompensas {
  background: rgba(0, 10, 29, 1);
  min-height: 100vh;

  .selectbox {
    width: 750px;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: #00102D;
    box-shadow: 0px -1px 0px 0px rgba(255, 255, 255, 0.1) inset;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    position: fixed;
    top: 110px;
    z-index: 1;
  }

  .listbox {
    background: rgba(217, 217, 217, 0.1);
    min-height: 100vh;
    padding-top: 76px;

    .list-item {
      margin: 30px 20px;
      padding: 20px 22px;
      border-radius: 20px;
      font-size: 28px;
      overflow: hidden;
      color: #fff;
      border: 1px solid rgba(14, 209, 244, 0.25);
      background: linear-gradient(180deg, rgba(4, 75, 154, 0.7) 0%, rgba(1, 26, 81, 0.7) 100%),
        linear-gradient(0deg, rgba(14, 209, 244, 0.25), rgba(14, 209, 244, 0.25));
      text-transform: capitalize;

      div+div {
        margin-top: 32px;
      }

      >div:nth-of-type(2) {
        font-size: 32px;
        color: rgba(14, 209, 244, 1);
      }

      >div:last-of-type {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
