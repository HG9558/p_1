<script setup lang='ts' name='refund'>
const router = useRouter()
const { isApp } = storeToRefs(useAppStore())

const { data } = useRequest(ApeGetRefundConfig)
const configList = computed(() => data.value ? data.value?.config_list : [])

const clickHandler = () => {
  if (isApp.value) return window.open('brazilapp://event?type=home')

  router.push('/')
}
</script>
<template>
  <AppHeader leftArrow placeholder title="Apostas cumulativas semanais" />
  <div class="refund">
    <AppImage src="/img/promotion/refund.png" alt="" class="banner" />
    <div class="text-box">
      <p style="margin-bottom: var(--app-px-10);">As apostas válidas acumulativas semanais lhe darão um grande presente!
      </p>
      <p>Obrigado por sua confiança e apoio, por seu valor de aposta efetivo cumulativo semanal, oferecemos até
        {{ data?.bonus_amount }} bônus
        de aposta! Transfira diretamente para sua conta todas as segundas-feiras à tarde às 14:00!
      </p>
      <br />
      <p class="ol" v-for="item, i in configList" :key="i">
        <span class="num">{{ i + 1 }}.</span>
        <span>Valor de aposta efetiva acumulativa semanal {{ item.flow_amount }}, obtenha {{ item.bonus_amount }}, e o
          valor de aposta efetiva
          cumulativa atinge a
          recompensa automática</span>
      </p>
      <p class="ol">
        <span class="num">{{ configList.length + 1 }}.</span>
        <span> Rejeitamos contas fraudulentas, uma vez descobertas, elas serão permanentemente congeladas.</span>
      </p>
      <p class="ol">
        <span class="num">{{ configList.length + 2 }}.</span>
        <span> O direito de interpretação final das atividades da plataforma pertence ao grupo cc (propriedade do
          LB88)</span>
      </p>
    </div>
    <AppButton @click="clickHandler" width="580" height="90" round blueToRight bold whiteText center>Recarregue
      agora
    </AppButton>
  </div>
</template>

<style lang='scss' scoped>
.refund {
  background: #000A1D;
  padding: 30px 20px 150px;
  color: #fff;
  font-size: 26px;
}

.blue {
  color: #0ED1F4;
}

.banner {
  width: 710px;
  display: block;
  margin-bottom: 30px;
}

.text-box {
  border-radius: 20px;
  border: 1px solid rgba(14, 209, 244, 0.25);
  background: linear-gradient(180deg, rgba(4, 75, 154, 0.30) 0%, rgba(1, 26, 81, 0.30) 100%);
  width: 100%;
  padding: 20px 25px;
  line-height: 40px;
  margin-bottom: 50px;

  .ol {
    display: flex;

    .num {
      margin-right: 14px;
    }
  }
}
</style>
