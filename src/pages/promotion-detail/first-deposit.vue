<script setup lang='ts' name='first-deposit'>
const router = useRouter()
const { isApp } = storeToRefs(useAppStore())

const clickHandler = () => {
  if (isApp.value) return window.open('brazilapp://event?type=deposit')

  router.push('/finance?tab=deposit')
}
</script>
<template>
  <AppHeader leftArrow placeholder title="Primeira recarga" />
  <div class="first-deposit">
    <AppImage src="/img/promotion/first-deposit.png" alt="" class="banner" />
    <div class="text-box">
      <p>Bônus de<span class="blue">&nbsp;20%&nbsp;</span>para o primeiro depósito </p>
      <p>Obrigado pela confiança e apoio. Para sua primeira recarga, oferecemos um bônus de recarga de até
        <span class="blue">&nbsp;20%&nbsp;</span>! As
        recompensas serão transferidas diretamente para sua conta após a recarga.
      </p>
      <p>Detalhes do evento:</p>
      <p class="ol">
        <span class="num">1.</span>
        O valor da sua primeira recarga deve ser superior a 50 reais.
      </p>
      <p class="ol">
        <span class="num">2.</span>
        <span>Cada conta tem apenas uma chance (depois de completar esta recompensa, você pode participar do evento de
          presente de recarga da plataforma).</span>
      </p>
      <p class="ol">
        <span class="num">3.</span>
        <span>O bônus de depósito será creditado diretamente em sua conta de depósito.</span>

      </p>
      <p class="ol">
        <span class="num">4.</span>
        <span>Rejeitamos contas fraudulentas, uma vez descobertas, elas serão permanentemente congeladas.</span>

      </p>
      <p class="ol">
        <span class="num">5.</span>
        <span>O direito de interpretação final das atividades da plataforma pertence ao grupo cc (propriedade do
          LB88)</span>
      </p>
    </div>
    <AppButton @click="clickHandler" width="580" height="90" round blueToRight bold whiteText center>Recarregue agora
    </AppButton>
    <p class="des"> Lembrete caloroso, certifique-se de que seu nome, número de telefone celular e número de conta CPF
      são
      únicos.
      Se o mesmo usuário registrar várias contas para receber bônus em dinheiro, consideraremos isso uma trapaça.
      Se isso acontecer, a conta relevante será permanentemente congelada.
      Nós não compensará as perdas causadas por trapaça!</p>
  </div>
</template>

<style lang='scss' scoped>
.first-deposit {
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
    margin-bottom: 15px;

    .num {
      margin-right: 14px;
    }
  }
}

.des {
  line-height: 40px;
  margin-top: 50px;
}
</style>
