<script setup lang='ts' name='deposit-bonus'>
const router = useRouter()
const { isApp } = storeToRefs(useAppStore())

const clickHandler = () => {
  if (isApp.value) return window.open('brazilapp://event?type=deposit')

  router.push('/finance?tab=deposit')
}
</script>
<template>
  <AppHeader leftArrow placeholder title="Recarga benefícios" />
  <div class="deposit-bonus">
    <AppImage src="/img/promotion/deposit-bonus.png" alt="" class="banner" />
    <p class="des">A partir de agora, a recarga pode obter recompensas extras em dinheiro.<br />
      Quanto mais você recarregar, maior será a taxa de recompensa, até 10%. Após a recarga, o dinheiro extra também
      será
      transferido diretamente para a sua conta.</p>
    <div class="text-box">
      <p>Nota especial:</p>
      <p>Certifique-se de que o seu número de conta, número de telemóvel e CPF são únicos.<br />
        Se o mesmo usuário registrar várias contas para obter bônus, consideraremos isso trapaceando e as contas
        relevantes serão congeladas permanentemente.
        Não faremos qualquer compensação pelas perdas causadas por trapaça.
      </p>
    </div>
    <AppButton @click="clickHandler" width="580" height="90" round blueToRight bold whiteText center>Recarregue agora
    </AppButton>
  </div>
</template>

<style lang='scss' scoped>
.deposit-bonus {
  background: #000A1D;
  padding: 30px 20px 150px;
  color: #fff;
  font-size: 26px;
  min-height: calc(100vh - 110px);
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
}

.des {
  line-height: 40px;
  margin-bottom: 30px;
}
</style>
