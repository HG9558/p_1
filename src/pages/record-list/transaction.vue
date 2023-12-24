<script setup lang='ts'>
import { colorFilter, stateFilter } from '~/utils/utils';
const tabList = [
  {
    label: 'Depósito',
    value: '271'
  }, {
    label: 'Retirar',
    value: '272'
  }
]
const formQuery = reactive({
  flag: '271',
  page: 1,
  page_size: 50
})
const total = ref(0)
const list = ref<any[]>([])
const finished = ref(false)
const { loading, run } = useRequest(() => ApiGetMemberRecord(formQuery), {
  onSuccess: (res) => {
    if (formQuery.page === 1) total.value = res.t

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
const refresh = () => {
  formQuery.page = 1
  finished.value = false
  list.value.length = 0
  run()
}
const loadMoreData = () => {
  formQuery.page++
  run()
}

const copyOrder = (id: any) => {
  copy(id);
  showToast('Copied!')
}
</script>

<template>
  <div class='p-record-transaction'>
    <div class="top-fixed">
      <app-header title="Transação" :fixed="false" leftArrow></app-header>
      <div class="tab-bg">
        <div class="tabbox">
          <AppTab :list-data="tabList" v-model="formQuery.flag" @change="refresh" :height="100" />
        </div>
      </div>

    </div>
    <div class="listbox">
      <AppList :loading="loading" :finished="finished" @refresh="refresh" @loadMoreData="loadMoreData"
        v-show="list.length">
        <div class="list-item" v-for="(item, index) in  list" :key="index">
          <div class="list-item-body">
            <div class="list-item-body-top">
              <span>ID da ordem: {{ item.bill_no }}</span>
              <AppImage src="/icons/i-copy-record.png" alt="" @click="copyOrder(item.bill_no)" class="img" />
            </div>
            <div class="list-item-line">
              <span>Valor</span> <span>{{ UsAmountFormat(item.amount) }}</span>
            </div>
            <!-- <div class="list-item-line">
              <span>valor do bônus</span> <span>{{ UsAmountFormat(item.discount) }}</span>
            </div> -->
            <div class="list-item-line">
              <span>Taxa de retirada</span> <span>{{ UsAmountFormat(item.fee) }}</span>
            </div>
            <div class="list-item-line">
              <span>Modelo</span> <span>{{ item.fname }}</span>
            </div>
            <div class="list-item-line">
              <span>{{ item.time }}</span> <span :style="{ color: colorFilter(item.state) }">{{
                stateFilter(item.state) }}</span>
            </div>
          </div>
        </div>
      </AppList>
      <app-empty v-show="!list.length" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.top-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  height: 210px;
}

.flex-sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.p-record-transaction {
  background: rgba(0, 10, 29, 1);
  min-height: 100vh;

  // overflow: hidden;
  .tab-bg {
    background-color: #00102D;
  }

  .tabbox {
    background: linear-gradient(180deg, rgba(1, 26, 81, 0) 35.94%, #011A51 100%);
  }

  .selectbox {
    padding: 8px 24px;
    display: flex;
    gap: 0 30px;
    box-shadow: 0px -1px 0px 0px rgba(255, 255, 255, 0.1) inset;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
  }

  .listbox {

    background: rgba(217, 217, 217, 0.1);
    padding-top: 210px;
    min-height: calc(100vh);

    .list-item {
      margin: 30px 20px;
      border-radius: 20px;
      font-size: 28px;
      overflow: hidden;
      color: #fff;
      border: 1px solid rgba(14, 209, 244, 0.25);
      background: linear-gradient(180deg, rgba(4, 75, 154, 0.7) 0%, rgba(1, 26, 81, 0.7) 100%),
        linear-gradient(0deg, rgba(14, 209, 244, 0.25), rgba(14, 209, 244, 0.25));

      &-body {
        padding: 24px 24px 20px 24px;

        &-top {
          @extend .flex-sb;
          line-height: 33px;
          padding-bottom: 18px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.25);

          >span:first-of-type {
            font-size: 32px;
            color: #0ED1F4;
          }

          .img {
            width: 36px;
          }
        }
      }

      &-line {
        @extend .flex-sb;
        line-height: 33px;
        height: 33px;
      }

      .list-item-line+.list-item-line {
        margin-top: 32px;
      }
    }
  }
}
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
