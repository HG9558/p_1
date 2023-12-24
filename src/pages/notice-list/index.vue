<script setup lang='ts' name='notice-list'>
// const loading = ref(false);
const finished = ref(false);
const page = ref(1)
const page_size = ref(50)
const allData = ref<any[]>([])
const total = ref(0)
const { run: runGetMessageList, loading } = useRequest(() => ApiGetMessageList({ page: page.value, page_size: page_size.value }), {
  onSuccess(res) {
    if (page.value === 1) total.value = res.t

    if (res.d) {
      const arr = res.d.map((item, index) => {
        const content = decodeURIComponent(item.content)
        const title = decodeURIComponent(item.title)
        const time = timestamp2Date(Date.parse(item.ts))

        return { ...item, content, title, time, index }
      })
      allData.value = [...allData.value, ...arr]
      getUnReadList()
    }
    if (allData.value.length >= total.value) finished.value = true
  }
})
const loadMoreData = () => {
  page.value++
  runGetMessageList()
}
const unRead = ref([])
 
const getUnReadList = () => { unRead.value = JSON.parse(JSON.stringify((allData.value.filter((i: any) => i.is_read === 0)))) }
const list = computed(() => {
  if (type.value === '1') return allData.value
  else if (type.value === '2') return unRead.value
})

const typeList = [
  { label: 'Todas', value: '1' }, // 全部
  { label: 'Nao Lido', value: '2' }, // 未读
]
const type = ref('1')
const onTabChange = () => {
  activeId.value = '0'
  if (type.value === '1') {
    allData.value.forEach((a: any) => {
      unRead.value.forEach((u: any) => {
        if (a.id === u.id) {
          a.is_read = u.is_read
        }
      })
    })
  }
  else if (type.value === '2') {
    getUnReadList()
  }
}


const activeId = ref('0')
const { run: readMessage } = useRequest(() => ApiReadMessage({ id: activeId.value }), { manual: true })
const onClick = (id: string, item: any) => {
  if (activeId.value === id) return activeId.value = '0'

  activeId.value = id

  if (item.is_read === 0) {
    readMessage()
    if (type.value === '1') {
      allData.value.forEach((d: any) => {
        if (d.id === id) {
          d.is_read = 1
        }
      })
    }
    else if (type.value === '2') {
      unRead.value.forEach((d: any) => {
        if (d.id === id) {
          d.is_read = 1
        }
      })
    }
  }
}

const delId = ref('')
const { run: runDelMessage } = useRequest(() => ApiDeleteMessage({ ids: delId.value }), {
  manual: true,
  onSuccess() {
    allData.value.splice(allData.value.findIndex(i => i.id === delId.value), 1)
    getUnReadList()
  }
})
const del = (id: string) => {
  delId.value = id
  runDelMessage()
}
</script>
<template>
  <div class="notice-list">
    <AppHeader title="Centro de Notificação" left-arrow placeholder />
    <div class="tab-bg">
      <AppTab @change="onTabChange" v-model="type" :list-data="typeList" />
    </div>

    <div class="body">
      <AppList :loading="loading" :finished="finished" @loadMoreData="loadMoreData" v-if="list && list.length > 0">

        <div class="notice-wrapper" v-for="item in list" :key="item.id" @click="onClick(item.id, item)">
          <van-swipe-cell>
            <div class="notice-item">
              <div class="title">
                <div class="left">
                  <p>{{ item.title }}</p>
                  <span class="dot" v-show="item.is_read === 0"></span>
                </div>
                <AppImage class="arrow" :class="{ active: item.id === activeId }" src="/icons/i-arrow-white-down.png"
                  alt="" />
              </div>
              <div class="time">{{ item.time }}</div>
              <div class="bottom" v-show="item.id === activeId">
                {{ item.content }}
              </div>
            </div>
            <template #right>
              <button class="del" @click="del(item.id)">Excluir</button>
            </template>
          </van-swipe-cell>
        </div>

      </AppList>

    </div>
  </div>
</template>

<style lang='scss' scoped>
.notice-list {
  font-size: 28px;
  color: #fff;
}

.tab-bg {
  background: linear-gradient(180deg, rgba(1, 26, 81, 0.00) 35.94%, #011A51 100%);
  box-shadow: 0px -1px 0px 0px rgba(255, 255, 255, 0.10) inset, 0px 4px 5px 0px rgba(0, 0, 0, 0.30);
}

.body {
  height: calc(100vh - 210px);
  overflow-y: auto;
  padding: 30px 20px 0;
}

.notice-wrapper {
  width: 100%;
  border-radius: 20px;
  border: 1px solid rgba(14, 209, 244, 0.25);
  background: linear-gradient(180deg, rgba(4, 75, 154, 0.70) 0%, rgba(1, 26, 81, 0.70) 100%);
  margin-bottom: 30px;
  overflow: hidden;
}

.notice-item {
  padding: 20px;

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .left {
      display: flex;
      align-items: center;

      p {
        max-width: 585px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .dot {
        width: 18px;
        height: 18px;
        display: block;
        background-color: #FB0404;
        border-radius: 50%;
        margin-left: 14px;
      }
    }

    .arrow {
      width: 28px;
      object-fit: contain;
      display: block;
      transition: all ease-in .15s;
    }

    .active {
      transform: rotate(180deg);
    }
  }

  .time {
    font-size: 24px;
  }

  .bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    margin-top: 17px;
    padding-top: 13px;
    line-height: 36px;
    transition: all ease-in .15s;
  }
}

.del {
  height: 100%;
  color: #fff;
  background-color: #FB0404;
  border: none;
  outline: none;
  padding: 0 10px;
  border-radius: 0 20px 20px 0;
}
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
