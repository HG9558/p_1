<script setup lang="ts">
interface AppSpinnerProps {
  size?: number
  strokeWidth?: number
  color?: string
}
const props = withDefaults(defineProps<AppSpinnerProps>(), {
  size: 40,
  strokeWidth: 4,
  color: 'pink'
})

const _size = +useCssVar('--app-px-'+props.size).value.split('vw')[0] * window.innerWidth / 100
const _strokeWidth = +useCssVar('--app-px-'+props.strokeWidth).value.split('vw')[0] * window.innerWidth / 100

const viewBox = computed(() => `0 0 ${_size} ${_size}`)

const halfSize = computed(() => _size / 2)
const halfStroke = computed(() => _strokeWidth / 2)
const pathRadius = computed(() => halfSize.value - halfStroke.value)

// 左边起点
const leftPoint = computed(() => `${halfStroke.value} ${halfSize.value}`)
// 右边起点
const rightPoint = computed(() => `${_size - halfStroke.value} ${halfSize.value}`)

const pathUpHalf = computed(
  () => `M ${leftPoint.value} A ${pathRadius.value} ${pathRadius.value} 0 0 1 ${rightPoint.value}`
)

const pathDownHalf = computed(
  () => `M ${rightPoint.value} A ${pathRadius.value} ${pathRadius.value} 0 0 1 ${leftPoint.value}`
)

const lineCapPath = computed(
  () =>
    `M ${leftPoint.value} A ${pathRadius.value} ${pathRadius.value} 0 0 1 ${halfStroke.value} ${
      halfSize.value - 2
    }`
)
</script>

<template>
  <svg
    :width="_size"
    :height="_size"
    :viewBox="viewBox"
    :color="props.color"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="spinner-upHalf">
        <stop offset="0%" stop-opacity="0" stop-color="currentColor" />
        <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
      </linearGradient>
      <linearGradient id="spinner-downHalf">
        <stop offset="0%" stop-opacity="1" stop-color="currentColor" />
        <stop offset="100%" stop-opacity="0.5" stop-color="currentColor" />
      </linearGradient>
    </defs>

    <g :stroke-width="_strokeWidth">
      <path stroke="url(#spinner-upHalf)" :d="pathUpHalf" />
      <path stroke="url(#spinner-downHalf)" :d="pathDownHalf" />

      <!-- 1deg extra path to have the round end cap -->
      <path stroke="currentColor" stroke-linecap="round" :d="lineCapPath" />
    </g>

    <animateTransform
      from="0 0 0"
      to="360 0 0"
      attributeName="transform"
      type="rotate"
      repeatCount="indefinite"
      dur="1300ms"
    />
  </svg>
</template>
<style lang="scss" scoped></style>
