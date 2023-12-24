<script setup lang='ts' name='telegram'>
import { openLink } from "~/utils/utils";
const { custService, isApp } = storeToRefs(useAppStore())
const telegram = computed(() => custService.value?.telegram)

const join = () => {
  if (isApp.value) return openLink(`brazilapp://event?type=telegram&url=${telegram.value}`)

  openLink(telegram.value as string)
}
</script>
<template>
  <AppHeader leftArrow placeholder title="Canal De Telegram" />
  <div class="telegram">
    <AppImage src="/img/promotion/telegram.png" alt="" class="banner" />
    <div class="text-box">
      <p style="margin-bottom: 10px;"> cc group (LB88) sinceramente convida você a se juntar ao nosso canal de
        telegrama, vamos nos comunicar
        mais profundamente!<br />
        Anunciaremos as seguintes atividades ou informações relacionadas no canal de telegrama:</p>
      <p class="ol">
        <span class="num">1.</span>
        <span>Quando a plataforma lançar novas atividades, iremos anunciá-las no canal do telegram o mais rápido
          possível.</span>
      </p>
      <p class="ol">
        <span class="num">2.</span>
        <span>Atualizaremos várias recompensas na plataforma de tempos em tempos no canal do telegrama.</span>
      </p>
      <p class="ol">
        <span class="num">3.</span>
        <span>Compartilhe regularmente recompensas de envelope vermelho de troca oficial do grupo cc (LB88) todos
          os dias.</span>
      </p>
      <p class="ol">
        <span class="num">4.</span>
        <span>A lista de ganhadores da plataforma será divulgada no canal do telegram o mais breve possível.</span>
      </p>
      <p class="ol">
        <span class="num">5.</span>
        <span>Anúncios e manutenções relacionados à plataforma serão divulgados no canal do Telegram assim que
          possível.</span>
      </p>
      <p class="ol">
        <span class="num">6.</span>
        <span>A atualização do mecanismo de recompensa por convite da plataforma será anunciada na plataforma do
          Telegram
          o mais rápido possível.</span>
      </p>
      <p class="ol">
        <span class="num">7.</span>
        <span>Questões como recarga e retirada serão anunciadas na plataforma do telegram assim que possível.</span>
      </p>
      <p class="ol">
        <span class="num">8.</span>
        <span>A manutenção do jogo relacionada à plataforma será anunciada na plataforma do telegram o mais rápido
          possível</span>
      </p>
    </div>
    <AppButton @click="join" width="580" height="90" round blueToRight bold whiteText center>Recarregue agora
    </AppButton>
  </div>
</template>

<style lang='scss' scoped>
.telegram {
  background: #000A1D;
  color: #fff;
  font-size: 26px;
  padding-top: 50px;
  padding-bottom: 100px;
}

.banner {
  width: 710px;
  display: block;
  margin: 0 auto;
}

.text-box {
  border-radius: 20px;
  border: 1px solid rgba(14, 209, 244, 0.25);
  background: linear-gradient(180deg, rgba(4, 75, 154, 0.30) 0%, rgba(1, 26, 81, 0.30) 100%);
  width: 100%;
  padding: 20px 30px;
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
</style>
