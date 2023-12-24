<script setup lang="ts">
interface AppNavBarProps {
  title?: string
  leftText?: string
  rightText?: string
  leftArrow?: boolean
  border?: boolean
  fixed?: boolean
  placeholder?: boolean
  zIndex?: number | string
  clickable?: boolean
  background?: string
  titleColor?: string
  textColor?: string
  titleWeight?: string | number
}
const props = withDefaults(defineProps<AppNavBarProps>(), {
  zIndex: 1,
  clickable: true,
  fixed: true,
  placeholder: false,
  titleWeight: 'normal'
})

const { isApp } = storeToRefs(useAppStore())
const emits = defineEmits(['clickLeft', 'clickRight', 'clickTitle'])

const slots = useSlots()

const show = ref(true)

const hasLeft = computed(() => props.leftArrow || props.leftText || slots.left)
const hasRight = computed(() => props.rightText || slots.right)

const styleNavBar = computed(() => {
  const style: any = {}
  style.background = props.background
  return style
})

const navLeftClick = function (e: any) {
  emits('clickLeft', e)
}

const navRightClick = function (e: any) {
  emits('clickRight', e)
}

const navTitleClick = function (e: any) {
  emits('clickTitle', e)
}

const toggle = function () {
  show.value = !show.value
}

defineExpose({ toggle })
</script>

<template>
  <div v-if="!isApp">
    <div v-if="fixed && placeholder" class="app-nav-bar__placeholder" />
    <Transition name="custom-classes" enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp">
      <div v-show="show" class="app-nav-bar"
        :class="{ 'app-nav-bar--fixed': fixed, 'has-left': hasLeft, 'has-right': hasRight }" :style="styleNavBar">
        <div class="app-nav-bar__content">
          <div v-if="hasLeft" class="app-nav-bar__left" @click="navLeftClick">
            <template v-if="slots.left">
              <slot name="left" />
            </template>
            <template v-else>
              <!-- <app-icon v-if="leftArrow" name="icon_nav_back" @click="$router.go(-1)" /> -->
              <div class="left-wrapper" @click="$router.go(-1)">
                <AppImage v-if="leftArrow" src="/icons/i-navback.png" class="left-arrow" />
              </div>

              <span v-if="leftText" class="app-nav-bar__text">{{ leftText }}</span>
            </template>
          </div>
          <div class="app-nav-bar__title app-ellipsis" :style="{ fontWeight: titleWeight }" @click="navTitleClick">
            <slot>
              {{ title }}
            </slot>
          </div>
          <div v-if="hasRight" class="app-nav-bar__right" @click="navRightClick">
            <template v-if="slots.right">
              <slot name="right" />
            </template>
            <template v-else>
              <span v-if="rightText" class="app-nav-bar__text">{{ rightText }}</span>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.left-wrapper {
  padding: 10px 20px 10px 0;
}

.left-arrow {
  width: 20px;
}

.app-nav-bar__placeholder {
  height: 110px;
}

.app-nav-bar {
  position: relative;
  z-index: 9;
  line-height: 1.1;
  text-align: center;
  background: var(--app-navbar-bg);
  user-select: none;

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  .app-nav-bar__content {
    position: relative;
    display: flex;
    align-items: center;
    height: 110px;

    .app-nav-bar__title {
      max-width: 70%;
      margin: 0 auto;
      color: var(--app-navbar-color);
      font-weight: normal;
      font-size: 36px;
    }

    .app-nav-bar__left,
    .app-nav-bar__right {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      padding: 0 40px;
      font-size: 14px;
    }

    .app-nav-bar__left {
      left: 0;

      .cg_icon {
        margin-right: 4px;
      }
    }

    .app-nav-bar__right {
      right: 0;
    }

    .app-nav-bar__text {
      color: var(--app-navbar-color);
    }
  }
}
</style>
