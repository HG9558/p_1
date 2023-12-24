<script setup lang="ts" name="app-index-latest-win">
const srcollDom = ref<HTMLElement | null>(null)
const srcollContentDom = ref<HTMLElement | null>(null)
const indexLastWinDom = ref<HTMLElement | null>(null)
const dataList = ref([])

let scrollTop = 0
let isStop = false
let isFetching = false

const { run: runMeberLastWin, data: meberLasetWinData } = useRequest(ApiGetMemerLastWin, {
  manual: true,
  onSuccess({ d }) {
    isFetching = true
    dataList.value = d || []
    nextTick(() => {
      startScroll()
    })
  }
})

/**
 * 获取距离头部最近的.scroll-item
 */
const getNearScrollItem = () => {
  const dom = srcollDom.value
  const contentDom = srcollContentDom.value
  const scrollItem = contentDom?.querySelector('.scroll-item')
  const scrollItemHeight = scrollItem?.clientHeight || 0
  const scrollItemMarginBottom = parseInt(getComputedStyle(scrollItem || document.body).marginBottom) || 0
  const currentScrollTop = dom?.scrollTop || 0

  const index = Math.floor(currentScrollTop / (scrollItemHeight + scrollItemMarginBottom))
  const nearScrollItem = contentDom?.querySelectorAll('.scroll-item')[index]

  // 返回下标
  return {
    index,
    nearScrollItem
  }
}

// let timer
let AnimationFrameId: number;

/**
 * 使用requestAnimationFrame实现无缝循环滚动
 */
const startScroll = () => {
  console.log('开始')
  const dom = srcollDom.value
  const contentDom = srcollContentDom.value
  const scrollItem = contentDom?.querySelector('.scroll-item')
  const scrollItemHeight = scrollItem?.clientHeight || 0
  const scrollItemMarginBottom = parseInt(getComputedStyle(scrollItem || document.body).marginBottom) || 0
  const itemHeight = scrollItemHeight + scrollItemMarginBottom
  const { index } = getNearScrollItem()
  let _index = index;
  // console.error('index', _index, nearScrollItem)
  scrollTop = dom?.scrollTop || 0
  isStop = false
  const scroll = () => {
    if (!isStop) {
      const scrollItemList = contentDom?.querySelectorAll('.scroll-item')
      if (_index < 3) _index = 3;
      const nearItemHeight = _index * itemHeight
      scrollTop += 0.5
      if (scrollTop >= nearItemHeight) {
        // 等最近的scroll-item滚动完，复制之前所有的scroll-item到最后
        const prevScrollItem = [...Array.from(scrollItemList!)].slice(0, _index);
        // prevScrollItem.push(nearScrollItem!)
        const setPrevScrollItem = Array.from(new Set(prevScrollItem))
        // console.error('setPrevScrollItem', setPrevScrollItem)
        // 复制之前所有的scroll-item到最后
        for (let i = 0; i < setPrevScrollItem.length; i++) {
          const item = setPrevScrollItem?.[i]
          if (!item) return
          const cloneItem = item.cloneNode(true)
          item.remove()
          contentDom?.appendChild(cloneItem)
        }
        scrollTop = 0
      }
      dom!.scrollTop = scrollTop
    }
    AnimationFrameId = requestAnimationFrame(scroll)
  }
  scroll()
}

const stopScroll = () => {
  console.log('停止')
  isStop = true
  cancelAnimationFrame(AnimationFrameId)
}

// 给indexLastWinDom添加IntersectionObserver
const addObserve = () => {
  const dom = indexLastWinDom.value
  if (!dom) return

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting && !isFetching) {
      runMeberLastWin()
    }
    if (entry.isIntersecting && isFetching) {
      startScroll()
    } else {
      stopScroll()
    }
  }, {
    threshold: 0.5
  })

  observer.observe(dom)
}

onMounted(() => {
  // startScroll()
  addObserve()
  // addObserve()
})

</script>

<template>
  <div class="app-index-latest-win" ref="indexLastWinDom">
    <div class="header">
      <AppImage class="win-img" src="/img/win.png" alt="" />
      <div class="size">
        <span>LATEST</span>
        <br>
        <span>WINNER</span>
      </div>
    </div>
    <div class="content" ref="srcollDom" @click="startScroll" @touchstart="stopScroll">
      <div class="scroll" ref="srcollContentDom">
        <AppIndexLatestWinItem v-for="(item, i) in dataList" :key="item" :data="item" class="scroll-item" :data-index="i"
          :class="{
            [`scroll-item-index-${i}`]: true
          }">
          {{ i }}
        </AppIndexLatestWinItem>
        <!-- <AppIndexLatestWinItem v-for="(item) in 10" :key="item" /> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-index-latest-win {
  height: 890px;
  border-radius: 30px;
  background: linear-gradient(180deg, #044B9A 0%, #011A51 100%), #1B2E1B;
  display: flex;
  flex-direction: column;

  .header {
    height: 208px;
    display: flex;
    align-items: center;
    justify-content: center;

    .win-img {
      width: 250px;
      vertical-align: middle;
      margin-top: -40px;
      margin-right: 47px;
    }

    .size {
      color: #A926FF;
      font-size: 64px;
      line-height: 54px;

      & span:first-child {
        color: #fff;
      }
    }
  }

  .content {
    flex: 1;
    padding: 0 20px;
    height: 0;
    overflow: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .scroll-item {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
