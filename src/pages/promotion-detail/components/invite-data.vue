<script setup lang='ts' name='invite-data'>
const { isApp } = storeToRefs(useAppStore())

const lvl = ref('1')
const lvlList = [
  { label: 'Equipe Nível 1', value: '1' },
  { label: 'Equipe Nível 2', value: '2' },
  { label: 'Equipe Nível 3', value: '3' },
]
const flag = ref('0')
const flagList = [
  { label: 'Todos', value: '0' },
  { label: 'Depositado', value: '1' },
  { label: 'não depositado', value: '2' },
]

const showDatePicker = ref(false)
const currentDate = ref({
  start: dayjs().subtract(7, 'day').format('YYYY/MM/DD'),
  end: dayjs().format('YYYY/MM/DD')
})
const dateStr = computed(() => currentDate.value.start + ' - ' + currentDate.value.end)
const onConfirm = (data: any) => {
  currentDate.value = data
  reloadData()
}
const reloadData = () => {
  list.value.length = 0
  page.value = 1
  finished.value = false
  runGetInviteRecord()
}

const list = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const page_size = ref(50)
const finished = ref(false)
const { loading, run: runGetInviteRecord } = useRequest(() => ApiGetInviteRecord({
  lvl: lvl.value,
  flag: flag.value,
  page: page.value,
  page_size: page_size.value,
  start_time: `${currentDate.value.start.replace(/\//g, '-')} 00:00:00`,
  end_time: `${currentDate.value.end.replace(/\//g, '-')} 23:59:59`,
}), {
  onSuccess(res) {
    if (page.value === 1) {
      total.value = res.t
    }

    if (res.d) {
      list.value = [...list.value, ...res.d]
    }

    if (list.value.length >= total.value) finished.value = true
  }
})
const loadMoreData = () => {
  page.value++
  runGetInviteRecord()
}
</script>
<template>
  <div class="invite-data">
    <div class="fix-box" :style="{ top: isApp ? 'var(--app-px-100)' : '' }">
      <AppRoundTab v-model="lvl" :list="lvlList" width="700" @change="reloadData" />
      <div class="select">
        <div class="select-date" @click="showDatePicker = true">
          <span>{{ dateStr }}</span>
          <AppImage class="down" src="/icons/down.png" alt="" />
        </div>
        <AppSelect v-model="flag" :listData="flagList" :width="266" @onSelect="reloadData" />
      </div>

      <!-- table -->
      <div class="table-head">
        <div class="th">Hora de<br />entrada</div>
        <div class="th">Número de<br />telefone</div>
        <div class="th">Primeira<br />recarga</div>
        <div class="th">Total de<br />transações</div>
      </div>
    </div>

    <AppList v-if="list && list.length > 0" @refresh="reloadData" :loading="loading" :finished="finished"
      @loadMoreData="loadMoreData">
      <div class="data-box">
        <div v-for="d in list" :key="d.id" class="table-row">
          <div class="td">{{ timestamp2Date(d.created_at) }}</div>
          <div class="td">{{ d.child_username }}</div>
          <div class="td">{{ d.deposit_amount }}</div>
          <div class="td">{{ d.bonus_amount }}</div>
        </div>
      </div>
    </AppList>
    <AppEmpty v-else :paddingTop="193" />

    <!-- date picker -->
    <AppDatePicker v-model="showDatePicker" :startDate="currentDate.start" group @confirm="onConfirm" />
  </div>
</template>

<style lang='scss' scoped>
.invite-data {
  padding: 400px 25px 0;
  font-size: 24px;
}

.fix-box {
  position: fixed;
  top: 210px;
  background-color: #000A1E;
  padding-top: 30px;
}

.select {
  width: 100%;
  margin: 30px auto;
  display: flex;
  justify-content: space-between;

  .select-date {
    width: 413px;
    height: 60px;
    border-radius: 8px;
    border: 1px solid #0ED1F4;
    padding-left: 24px;
    padding-right: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #0ED1F4;

    img {
      height: 16px;
    }
  }
}

.table-head {
  width: 100%;
  height: 96px;
  border-radius: 20px;
  border: 1px solid rgba(14, 209, 244, 0.25);
  background: linear-gradient(180deg, rgba(4, 75, 154, 0.30) 0%, rgba(1, 26, 81, 0.30) 100%);
  display: flex;

  .th {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-right: 1px solid rgba(14, 209, 244, 0.25);

    &:last-of-type {
      border: none;
    }
  }
}

.data-box {
  width: 100%;
}

.table-row {
  width: 100%;
  height: 102px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;

  .td {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    text-align: center;

    &:nth-of-type(2) {
      word-break: break-all;
    }
  }
}
</style>
