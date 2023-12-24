<script setup lang="ts" name="app-game-filter">
import { GameNavEnum } from '~/types/common'
const tagsDefault = [
  {
    label: 'Nova',
    value: '0',
    id: '0'
  },
];

interface Props {
  id: GameNavEnum
  platform?: any
  setFilterGameParam?: Function
}

const props = withDefaults(defineProps<Props>(), {
  setFilterGameParam: () => { }
})

const route = useRoute()

const isNormalGameType = computed(() => {
  return +props.id !== GameNavEnum.Quente && +props.id !== GameNavEnum.Dentro_De_Casa
})

const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
const gameStore = useGameStore()
const { gameNavData, queryGamePlat } = storeToRefs(gameStore) // , gameNavInit, queryGameTag

const curGameNav = computed(() => gameNavData.value.filter(g => g.id === +props.id)[0])

const curTag = ref('0')

const showBottom = ref(false)
const searchValue = ref('')
const scrollTabList = ref(tagsDefault)
const filterTabRef = ref()

const showTags = ref(true)

// props.platform ? props.platform.id : 
const { run: getTags } = useRequest(() => ApiGameTags({ game_type: +props.id || 0, platform_id: 0 }), {
  manual: true,
  onSuccess: (data) => {
    scrollTabList.value = tagsDefault
    if (data && data.length) {
      scrollTabList.value = scrollTabList.value.concat(data.map((i: any) => ({ ...i, label: i.name, value: i.tid })))
    }
  },
  onError: () => {
    scrollTabList.value = tagsDefault
  },
  onAfter: () => {
    gameStore.setQueryGameTag(scrollTabList.value[0].value)
    nextTick(() => {
      setTimeout(() => {
        if (filterTabRef.value && tagsBox.value) {
          const filterTabRefRect = filterTabRef.value.getBoundingClientRect()
          const tagsBoxRect = tagsBox.value.getBoundingClientRect()
          if (tagsBoxRect.height - filterTabRefRect.height > 10) {
            showArrowDown.value = true
          } else {
            showArrowDown.value = false
          }
        } else {
          showArrowDown.value = true
        }
      }, 500);
    })
  }
})

const categoryList = ref([
  {
    label: 'sg',
    value: 0,
    show: () => +props.id !== GameNavEnum.Quente && +props.id !== GameNavEnum.Dentro_De_Casa
  }, {
    label: 'hot',
    value: 1,
    show: () => +props.id !== GameNavEnum.Quente && +props.id !== GameNavEnum.Dentro_De_Casa
  }, {
    label: 'love',
    value: 2,
    show: () => +props.id !== GameNavEnum.Quente
  }, {
    label: 'search',
    value: 3,
    show: () => +props.id !== GameNavEnum.Quente && +props.id !== GameNavEnum.Dentro_De_Casa
  }
])
const categoryActive = ref(0)
const changeCategoryItem = (item: any) => {
  switch (item.value) {
    case 0:
      categoryActive.value = item.value
      searchValue.value = ''
      showTags.value = true
      gameStore.setQueryGamePlat(dataList.value[0])
      gameStore.setQueryGameTag(scrollTabList.value[0].value)
      props.setFilterGameParam({ is_hot: undefined, is_love: undefined, en_name: undefined })
      break
    case 1:
      categoryActive.value = item.value
      showTags.value = false
      props.setFilterGameParam({ is_hot: 1, is_love: undefined, en_name: undefined })
      break
    case 2:
      showTags.value = false
      if (isLogin.value) {
        categoryActive.value = item.value
        props.setFilterGameParam({ is_hot: undefined, is_love: 1, en_name: undefined })
      } else {
        appStore.setLoginDialogVisible(true)
      }
      break
    case 3:
      showBottom.value = true
      break
    default:
      break
  }
}

const dataList = ref([
  {
    label: 'All',
    value: '0',
    id: '0',
  }
])


gameStore.setQueryGamePlat(dataList.value[0])

// const renderList = computed(() => {
//   if (gameNavInit.value[+props.id]) {
//     return dataList.value.concat(gameNavInit.value[+props.id].map((i: any) => ({ ...i, label: i.name, value: i.id })))
//   }
// })

const closeDialog = () => {
  showBottom.value = false
  // categoryActive.value = 0
}

const init = () => {
  curTag.value = '0'
  categoryActive.value = 0
  searchValue.value = ''
  expandTags.value = false
  filterTagHeight.value = 0
  gameStore.setQueryGamePlat(dataList.value[0])
  gameStore.setQueryGameTag(scrollTabList.value[0].value)
  if (route.path.indexOf('/game-list/') !== -1 && +props.id > 0 && isNormalGameType.value) {
    getTags()
  }
}

const rtchange = (tag: any) => {
  curTag.value = tag.value
  // gameStore.setQueryGameTag(tag.value)
  props.setFilterGameParam({ en_name: searchValue.value, tag: tag.value, is_hot: undefined, is_love: undefined })
}

const searchConfirm = () => {
  props.setFilterGameParam({ en_name: searchValue.value, is_hot: undefined, is_love: undefined })
  if (queryGamePlat.value.id !== '0' || searchValue.value) {
    categoryActive.value = 3
    showTags.value = true
  }
}

if (route.path.indexOf('/game-list/') !== -1 && +props.id > 0 && isNormalGameType.value) {
  getTags()
}

watch(() => props.id, () => {
  init()
})

const expandTags = ref(false)
const filterTagHeight = ref(0)
const tagsBox = ref()
const toggleTags = () => {
  const { height } = tagsBox.value.getBoundingClientRect()
  expandTags.value = !expandTags.value
  if (expandTags.value) {
    filterTagHeight.value = Math.ceil(+height)
  } else {
    filterTagHeight.value = 0
  }
}

const showArrowDown = ref(false)

// const setPlatform = (item: any) => {
//   if (item.id === '0') {
//     categoryActive.value = 0
//   }
//   gameStore.setQueryGamePlat(item)
// }

</script>

<template>
  <div class="app-game-filter">
    <div v-if="+id !== GameNavEnum.Quente" class="filter-category">
      <div v-if="isNormalGameType" class="left">
        <!-- <div v-html="curGameNav?.name"></div> -->
        <div class="plat" v-if="platform" v-html="platform.name"></div>
        <template v-else>
          <div class="plat" v-if="queryGamePlat.value !== '0'">{{ queryGamePlat.label }}</div>
        </template>
      </div>
      <!-- <div class="right">
        <template v-for="(item, i) in categoryList" :key="item.value">
          <div v-if="item.show ? item.show() : true" class="item" @click="changeCategoryItem(item)" :class="{
            active: categoryActive === item.value
          }">
            <AppImage :src="`/icons/i-filter${i + 1}.png`" alt="" />
          </div>
        </template>
      </div> -->
    </div>
    <!-- <div v-if="isNormalGameType && showTags" ref="filterTabRef" class="filter-tab" :class="{ expand: expandTags }"
      :style="{ height: filterTagHeight > 0 ? filterTagHeight + 'px' : 'var(--app-px-54)' }">
      <ul class="tags" ref="tagsBox">
        <li v-for="tag in scrollTabList" v-html="tag.label" @click="() => rtchange(tag)" class="tag"
          :class="{ active: curTag === tag.value }"></li>
      </ul>
      <AppImage v-show="showArrowDown" src="/icons/i-arrow-down3x.png" class="down" :class="{ up: expandTags }"
        @click="toggleTags" />
    </div> -->
  </div>
  <van-popup v-model:show="showBottom" class="van-popup-transparent" position="bottom" teleport="body"
    :style="{ height: '100%' }">
    <div class="filter-content" @click="closeDialog">
      <div @click.stop>
        <div class="title1">
          Category
        </div>
        <div class="input">
          <AppInput v-model="searchValue" width="auto" icon-left="i-filter4" placeholder="To search for" clearable />
        </div>
        <!-- <div>
          <div class="title2">Providers</div>
          <div class="filter-tab-list">
            <div v-for="item in renderList" :key="item.value" class="plat-item"
              :class="{ active: item.value === queryGamePlat.value }" @click="() => setPlatform(item)">
              <div class="text">{{ item.label }}</div>
            </div>
          </div>
        </div> -->
      </div>

      <div class="confirm">
        <AppButton width="712" height="90" bold blue-to-right :radius="45" white-text font-size="28"
          @click="searchConfirm">
          confirm
        </AppButton>
      </div>
      <AppImage class="close" src="/icons/dialog-close.png" alt="" />
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.plat-item {
  width: 220px;
  height: 86px;
  line-height: 32px;
  padding: 0 20px;
  white-space: normal;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: #011A51;
  color: rgba(255, 255, 255, 0.40);
  text-align: center;
  font-size: 26px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background: linear-gradient(358deg, #1373EF 0%, #0ED1F4 100%), #000;
    color: #FFF;
    font-weight: 700;
  }

  .text {
    max-height: 64px;
    overflow: hidden;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: rgba(255, 255, 255, 0.40);
  text-align: center;
  font-size: 24px;
  font-weight: 400;
  transition: all 500ms ease-in-out;

  .tag {
    border-radius: 30px;
    height: 54px;
    line-height: 54px;
    padding: 0 14px;
    background: #011A51;

    &.active {
      background: linear-gradient(358deg, #1373EF 0%, #0ED1F4 100%), #000;
      color: #FFF;
      font-size: 24px;
      font-weight: 700;
    }
  }
}

.confirm {
  margin-top: 40px;
}

.filter-content {
  height: 100%;
  color: #fff;
  padding: 110px 18px;
  background: rgba(0, 0, 0, 0.45);
  position: relative;

  .close {
    position: absolute;
    width: 40px;
    right: 27px;
    top: 35px;
  }

  .filter-tab-list {
    // grid，每行显示 3 个
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 27px;
  }

  .title1 {
    text-align: center;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 40px;
  }

  .title2 {
    font-size: 32px;
    padding: 30px 0 24px 0;
  }
}

.app-game-filter {
  color: #fff;

  .filter-category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;

    .left {
      color: #FFF;
      font-size: 32px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: nowrap;
      gap: 16px;

      .plat {
        // color: #0ED1F4;
        // font-size: 26px;
        // font-weight: 400;
      }
    }

    .right {

      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex: 1;

      .item {
        width: 60px;
        height: 60px;
        border-radius: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 12px;
        background: linear-gradient(180deg, rgba(4, 75, 154, 0.70) 0%, rgba(1, 26, 81, 0.70) 100%);

        img {
          width: 32px;
        }

        &.active {
          background: linear-gradient(358deg, #1373EF 0%, #0ED1F4 100%);
        }
      }
    }
  }

  .filter-tab {
    --van-border-width: 0;
    --van-tabs-default-color: transparent;
    --van-tabs-card-height: 54px;
    --van-padding-md: 0;
    --van-padding-sm: 0;
    position: relative;
    overflow: hidden;
    height: 54px;
    padding-right: 24px;
    transition: all 300ms ease-in-out;

    &.expand {}

    .down {
      width: 20px;
      position: absolute;
      top: 27px;
      transform: translateY(-50%);
      right: 0;
      transition: all 250ms ease-in-out;
      transform: rotate(0);
      transform-origin: center;

      &.up {
        transform: rotate(-180deg);
      }
    }
  }
}
</style>
