<script setup lang="ts" name="appList">
import type { ListProps } from 'vant';
import type { PullRefreshProps } from 'vant'

type IListProps = Partial<ListProps>
type IPullRefreshProps = Partial<PullRefreshProps>
const bottomObservable = ref<HTMLDivElement | null>(null)
interface AppListProps {
  pullRefreshProps?: IPullRefreshProps,
  listProps?: IListProps
  loading?: boolean
  finished?: boolean
  successText?: string
  disabledPullRefresh?: boolean
}
// 123
const refreshing = ref<boolean>(false)
const props = withDefaults(defineProps<AppListProps>(), {
  loading: false, // 是否正在加载中
  finished: false, // 是否加载完所有数据
  successText: "Atualizar com sucesso",
  disabledPullRefresh: false,
})

const emit = defineEmits(['refresh', 'loadMoreData']);

const refresh = () => {
  refreshing.value = false
  emit('refresh')
}

const onLoad = () => {
  console.log('321321加载更多')
  // 执行上拉加载更多的操作
  emit('loadMoreData')
}
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !props.finished) {
        onLoad();
      }
    })
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0
  })

  observer.observe(bottomObservable.value!)
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})

const pullingText = 'Puxe para baixo para atualizar...'
const loosingText = 'Solte para atualizar...'
</script>

<template>
  <div class="app_list">
    <VanPullRefresh :disabled="props.disabledPullRefresh" v-model="refreshing" @refresh="refresh"
      :success-text="successText" :pulling-text="pullingText" :loosing-text="loosingText" v-bind="props.pullRefreshProps">
      <VanList :loading="loading" :finished="finished" finished-text="Não Mais" loading-text="Carregando..."
        v-bind="props.listProps">
        <slot></slot>
        <div ref="bottomObservable" class="bottom__observable" style="height: 1px;"></div>
      </VanList>
    </VanPullRefresh>
  </div>
</template>
<style scoped>
::v-deep(.van-cell) {
  background: none;
}
</style>
