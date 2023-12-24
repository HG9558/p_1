<template>
  <div class="c-app-progress" :style="{
    minWidth: width !== undefined ? $toPx(width) : '100%'
  }">
    <div class="text" v-if="placeholder">
      {{ placeholder }}:
      <span>
        {{ value }}/{{ max }}
      </span>
    </div>
    <div class="progress" :style="{
      width: width !== undefined ? $toPx(width) : '100%'
    }">
      <div class="progress-bottom"></div>
      <div class="progress-top" :style="{
        width: progress + '%'
      }">
        <span> {{ progress + '%' }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="AppProgress">
import { computed } from "vue";
export interface AppProgressProps {
  value: number | string,
  placeholder?: string,
  max: number | string,
  width?: number,
}
const props = defineProps<AppProgressProps>();
const progress = computed(() => {
  const result = ((+props.value / +props.max) * 100).toFixed(2)
  return Number.isNaN(Number(result)) ? 0 : result;
})
</script>
<style lang="scss">
.c-app-progress {
  box-sizing: border-box;
  font-size: 24px;
  color: var(--app-text-color);

  .text {
    margin-bottom: 17px;
    height: 33px;
    line-height: 33px;

    >span {
      color: var(--app-text-color-2);
    }
  }

  .progress {
    border-radius: 100px;
    overflow: hidden;
    height: 30px;
    position: relative;

    .progress-bottom {
      background-color: #00000040;
      width: 100%;
      height: 100%;
    }

    .progress-top {
      height: 100%;
      background: linear-gradient(90.3deg, #0BE3FF 5.43%, #FFD90C 94.35%);
      position: absolute;
      top: 0;
      transition: all .5s ease-out;

      >span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 22px;
      }
    }
  }
}
</style>
