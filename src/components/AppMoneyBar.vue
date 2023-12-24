<script lang="ts" setup>
// interface AppMoneyBarProps {
//   icon?: string
//   isRefresh?: boolean
// }
// const props = withDefaults(defineProps<AppMoneyBarProps>(), {
//   icon: 'i-refresh-money',
//   isRefresh: true,
// })

// const emits = defineEmits(['iconClick'])

const amount = ref('0.00')

// const iconPath = computed(() => `/icons/${props.icon}.png`)

const refreshMoney = () => {

}

// const iconClick = () => {
//   if (props.icon === 'i-refresh-money' || props.isRefresh) {
//     refreshMoney()
//   } else {
//     emits('iconClick')
//   }
// }

defineExpose({ refreshMoney })
</script>

<template>
  <div class="app-money-bar">
    <span class="label">R$</span>
    <span class="amount">{{ amount }}</span>
    <!-- <AppImage v-if="icon" :src="iconPath" @click="iconClick" /> -->
  </div>
</template>

<style lang="scss" scoped>
[theme='blue']:root {
  --app-moneybar-color: #fff;
  --app-moneybar-label-color: #fff;
  --app-moneybar-amount-color: #fff;
  --app-moneybar-icon-width: 48px;
  --app-moneybar-fontweight: 700;
  --app-moneybar-fontsize: 42px;
  --app-moneybar-gap: 0;
}

.app-money-bar {
  display: flex;
  align-items: center;
  color: var(--app-moneybar-color);
  font-weight: var(--app-moneybar-fontweight);
  font-size: var(--app-moneybar-fontsize);

  .label {
    color: var(--app-moneybar-label-color);
  }

  .amount {
    color: var(--app-moneybar-amount-color);
    padding-left: var(--app-moneybar-gap);
    // padding-right: 8px;
  }

  img {
    width: var(--app-moneybar-icon-width);
  }
}</style>
