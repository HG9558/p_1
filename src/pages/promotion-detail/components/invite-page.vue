<script setup lang='ts' name='invite-page'>
const { userInfo } = storeToRefs(useAppStore())
const url = computed(() => location.origin + '/register' + `?link_id=${userInfo.value.invite_code}`)

const toCopy = (str: string) => {
  showToast('Copied!')
  copy(str)
}

const swipeList = [
  { img: 0, text: '"Jesus, um trabalhador aposentado, lucrou mais de R$ 100.000 em apenas dois meses com a promoção de LB88!"' },
  { img: 1, text: '"Santos, um professor do ensino médio, comprou um carro com os lucros mensais que obteve promovendo LB88."' },
  { img: 2, text: '"Silva é recém-formada, e agora através da promoção de LB88, o lucro que ela ganha todos os meses é suficiente para pagar o aluguel do meu estágio no estado do Ceará."' },
  { img: 3, text: '"Ferreira é trabalhador aposentado de uma fábrica no estado do Rio de Janeiro. Através de 2 meses de promoção contínua, ganhei mais de 20.000 reais em dois meses."' },
  { img: 4, text: '"Pereira é dona de casa e a comissão que ganha mensalmente com a promoção de LB88 é suficiente para pagar as mensalidades escolares de seus quatro filhos."' },
  { img: 5, text: '"Oliveira, como professora do ensino médio, conseguiu realizar seu sonho de comprar um carro promovendo LB88 e obtendo lucros mensais!"' },
  { img: 6, text: '"Costa é um advogado de renome e ganha milhões de dólares em lucros todos os meses através da promoção de LB88."' },
  { img: 7, text: '"Sousa, aposentado, ganhou milhares de reais em apenas dois meses com a promoção de LB88!"' },
  { img: 8, text: '"Rodrigues, como um entusiasta sênior de caça-níqueis, ganha facilmente centenas de milhares de reais em lucros todos os meses por meio da promoção de LB88."' },
  { img: 9, text: '"Martins é um empresário de TI de sucesso que ganha dezenas de milhares de reais em lucros todos os meses por meio da promoção de LB88."' },
]
</script>
<template>
  <div class="invite-page">
    <div class="banner">
      <p>Ao jogar e ganhar prêmios na plataforma LB88, os usuários também podem ganhar generosas comissões por meio do programa de recompensa por convite! Promova usuários com recarga válida, com bônus máximo de 20 reais. Ao mesmo tempo, você também pode obter descontos generosos no volume de negócios do jogo!</p>
    </div>
    <div class="body">
      <div class="swipe-wrapper">
        <AppImage class="casos" src="/img/promotion/invite-casos.png" alt="" />
        <van-swipe class="my-swipe" :autoplay="3000" :show-indicators="false">
          <van-swipe-item v-for="i in swipeList" :key="i.img">
            <div class="swipe-item">
              <AppImage class="avatar" :src="`/img/promotion/invite-avatar${i.img}.png`" alt="" />
              <p>{{ i.text }}</p>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <h6>Clique no botão para copiar o link do convite</h6>
      <div class="url-box">
        <span class="url">{{ url }}</span>
        <AppButton @click="toCopy(url)" width="150" height="70" blue-to-bottom bold white-text radius="8">Cópia
        </AppButton>
      </div>
      <h6>Partilhar ligações através de software social</h6>
      <div class="social">
        <AppImage src="/img/promotion/invite-social.png" alt="" />
      </div>
      <AppImage class="img-group" src="/img/promotion/invite-group.png" alt="" />
      <p class="text">Fornecer à LB88 um convite efetivo ao cliente (o cliente deve preencher o registro do número
        do celular e concluir uma recarga).
      </p>
      <p class="text">Recompensamos 20.00 reais. Ao mesmo tempo, realizamos anticomissões de acordo com o valor da aposta do jogo do
        usuário do jogo na plataforma do jogo (a comissão é considerável).
      </p>
      <p class="text">A taxa de comissão varia de jogo para jogo.</p>
      <div class="example">
        <p>Por exemplo:</p>
        <p>tom se cadastrou como usuário válido de LB88 em 10 de abril de 2023.</p>
        <p>Enquanto ganhava o grande prêmio na plataforma, ele também recomendou um colega da empresa.</p>
        <p>O colega concluiu o cadastro e recarregou 25 reais. Nesse momento, tom ganhou 20.00 reais Este colega adora
          jogos de LB88 e aposta um total de 534.034 reais por 3 dias consecutivos.</p>
        <p>De acordo com a política de descontos do LB88, tom ganha mais 2.670,17 reais
          de comissão. Ao mesmo
          tempo, este colega recomenda LB88 para seus amigos, de acordo com o LB88 política de descontos,
          Tom também desfruta da política relevante de descontos de apostas do amigo de seu colega.</p>
      </div>
      <p class="text-yellow">Regras de liquidação da plataforma LB88：</p>
      <p class="text-yellow">A comissão devolvida pelo LB88 será liberada à 01h, horário de Brasil</p>
      <p class="text-yellow">Clique em "Convite diário" e "Detalhes do convite" para ver os detalhes da comissão
      </p>
      <div class="warn">
        Declaração especial: Para garantir a justiça da plataforma, a plataforma adota uma estratégia antitrapaça, e os
        usuários trapaceiros serão banidos permanentemente, os fundos obtidos ilegalmente serão congelados e as
        responsabilidades legais relevantes serão investigadas.
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
@import '../../../theme/mixin.scss';

.invite-page {
  font-size: 26px;
  font-weight: 700;
  padding-top: 100px;

  .banner {
    // background-image: url();
    @include webp('/img/promotion/invite-banner.png');
    width: 100%;
    height: 390px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 115px 0 0 154px;
    font-size: 24px;
    margin-bottom: 29px;

    p {
      width: 531px;
      height: 228px;
      overflow-y: auto;
    }
  }

  .body {
    padding: 0 25px 150px;
  }

  .swipe-wrapper {
    height: 248px;
    width: 700px;
    margin: 0 auto 50px;
    border-radius: 20px;
    border: 1px solid #FCBC1B;
    background: linear-gradient(180deg, #FA595F 0%, #FF9F39 100%);

    .casos {
      width: 172px;
      display: block;
      margin: 0 auto;
    }

    .my-swipe {
      height: 161px;
      width: 700px;

      .swipe-item {
        display: flex;
        align-items: center;
        padding-left: 25px;

        .avatar {
          width: 100px;
          margin-right: 23px;
          border-radius: 50%;
        }

        p {
          line-height: 30.47px;
        }
      }
    }
  }

  h6 {
    color: #0ED1F4;
    font-size: 28px;
    margin-bottom: 12px;
  }

  .url-box {
    width: 100%;
    height: 72px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: linear-gradient(0deg, #011A51 0%, #011A51 100%), #2A2E3E;
    display: flex;
    align-items: center;
    padding-left: 24px;
    margin-bottom: 30px;

    .url {
      display: block;
      width: 521px;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 28px;
      font-weight: 400;
      overflow: hidden;
      margin-right: 13px;
    }
  }

  .social {
    width: 100%;
    height: 120px;
    border-radius: 20px;
    background: linear-gradient(180deg, #044B9A 0%, #011A51 100%);
    padding: 28px;
    text-align: center;
    margin-bottom: 50px;

    img {
      width: 618px;
    }
  }

  .img-group {
    width: 100%;
    margin-bottom: 30px;
  }

  .text {
    line-height: 30.47px;
    margin-bottom: 10px;
  }

  .text-yellow {
    @extend .text;
    color: #FFD61C;
  }

  .example {
    width: 100%;
    margin-top: 40px;
    border-radius: 20px;
    border: 1px solid rgba(14, 209, 244, 0.25);
    background: linear-gradient(180deg, rgba(4, 75, 154, 0.30) 0%, rgba(1, 26, 81, 0.30) 100%);
    padding: 20px 25px 10px;
    margin-bottom: 30px;


    p {
      margin-bottom: 10px;
      line-height: 30.47px;
    }
  }

  .warn {
    width: 100%;
    margin-top: 30px;
    border-radius: 20px;
    border: 1px solid rgba(14, 209, 244, 0.25);
    background: rgba(255, 14, 14, 0.10);
    color: #FF1C1CCC;
    line-height: 30.47px;
    padding: 20px 25px;
  }
}
</style>
