<script setup lang='ts' name='app-button'>
interface Props {
  width: number | string // 宽
  height: number | string // 高
  bold?: boolean // 文字加粗
  round?: boolean // 半圆按钮
  radius?: number | string // 圆角
  shadow?: boolean // 阴影
  yellowToBottom?: boolean // 黄色
  yellowToRight?: boolean // 黄色
  blueToBottom?: boolean // 蓝色
  blueToRight?: boolean // 蓝色
  blueToRightDeep?: boolean // 蓝色深
  orange?: boolean
  blue?: boolean
  special?: boolean // 特殊
  inline?: boolean // 内联
  center?: boolean // 居中
  disabled?: boolean
  whiteText?: boolean // 白色文字
  fontSize?: number | string // 字体大小
  loading?: boolean
}
const props = defineProps<Props>()

const loadingWidth = computed(() => {
  if (+props.width >= 500) {
    return 35
  }
  else if (+props.width >= 300) {
    return 30
  }
  else {
    return 25
  }
})
</script>
<template>
  <div class="special" v-if="special">
  </div>

  <button v-else :style="{
    width: $toPx(+width),
    height: $toPx(+height),
    borderRadius: radius ? $toPx(+radius) : '',
    fontSize: fontSize ? $toPx(+fontSize) : '',
  }"
    :class="{ bold, round, shadow, yellowToBottom, yellowToRight, blueToBottom, blueToRight, blueToRightDeep, orange, blue, inline, center, whiteText, loading }"
    :disabled="disabled || loading">
    <AppLoading :width="loadingWidth" :borderWidth="3" v-if="loading" />
    <slot v-else />
  </button>
</template>

<style lang='scss' scoped>
@import '../theme/mixin.scss';

button {
  font-size: 32px;
  font-weight: 400;
  border: none;
  display: block;
  color: #000;

  &:disabled {
    opacity: 0.3;
  }
}

.whiteText {
  color: #fff;
}

.bold {
  font-weight: 700;
}

.round {
  border-radius: 750px;
}

.shadow {
  box-shadow: 0px -3px 6px 0px #FFFFFF40 inset, 0px -2px 3px 0px #FFFFFF;
}

.yellowToBottom {
  background-image: linear-gradient(to bottom, #FFD500, #FF9901);
}

.yellowToRight {
  background-image: linear-gradient(to right, #FFD500, #FF9901);
}


.blueToBottom {
  background: linear-gradient(to bottom, #0ED1F4, #1373EF, ),
}

.blueToRight {
  background: linear-gradient(to right, #0ED1F4, #1373EF, ),
}

.blueToRightDeep {
  background: linear-gradient(312deg, rgba(19, 115, 239, 0.30) 0%, rgba(14, 209, 244, 0.30) 100%);
}

.orange {
  background: #F5C31B;
}

.blue {
  background: rgba(15,196,244,.2);
}

.special {
  width: 426px;
  height: 134px;
  // background-image: url('/img/special-btn.png');
  @include webp('/img/special-btn.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}

.inline {
  display: inline-block;
}

.center {
  display: block;
  margin: 0 auto;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
