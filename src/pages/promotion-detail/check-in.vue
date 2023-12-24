<script setup lang='ts' name='check-in'>
const router = useRouter()
const { userInfo, isLogin, isApp, token } = storeToRefs(useAppStore())

const { data } = useRequest(ApiGetPromotionSignConfig, {
  onSuccess(res) {
    console.log('签到配置数据:', res);
  }
})
const levelList = computed(() => data.value?.map((d) => ({ label: `VIP ${d.vip}`, value: d.vip })) ?? [])
const userLevel = computed(() => userInfo.value.vip ?? -1)
const currentVip = ref(userLevel.value)
const tabChange = (d: any) => {
  currentVip.value = d.value
}
const amountData: any = computed(() => {
  if (currentVip.value === -1) {
    return userLevel.value > -1 ? data.value?.find(a => a.vip === userLevel.value) : {}
  }
  else {
    return data.value?.find(a => a.vip === currentVip.value) ?? {}
  }
})
watch(userLevel, (a) => { currentVip.value = a })

const lastSignDay = ref(-1)
const { data: signRecord, run: runSignRecord } = useRequest(ApiGetPromotionSignRecord, {
  ready: isLogin,
  onSuccess(res) {
    console.log('签到状态', res);
    for (let i = 7; i > 0; i--) {
      if ((res as any)[`sign${i}`] === '1') {
        lastSignDay.value = i
        break
      }
    }
  }
})

const signDay = ref(-1)
const { run: runSign } = useRequest(() => ApiMemberSign(signDay.value), {
  manual: true,
  onSuccess() {
    showToast('Entrar com sucesso')
    runSignRecord()
  }
})
const checkIn = () => {
  if (!isLogin.value) return openLoginDialog()

  if (signRecord.value && isLogin.value) {
    for (let i = 1; i < 8; i++) {
      if ((signRecord.value as any)[`sign${i}`] === '0') {
        signDay.value = i
        runSign()
        break
      }
    }
  }
}
const goRecord = () => {
  if (!isLogin.value) return openLoginDialog()

  const query = isApp.value ? `?is-app=1&t=${token.value}` : ''
  router.push(`/record-list/check-in${query}`)
}
</script>
<template>
  <div class="check-in" :style="{ paddingTop: isApp ? 'var(--app-px-30)' : '' }">
    <AppHeader leftArrow title="Recompensa de check-in" :placeholder="true" />
    <div class="main">
      <AppImage class="title" src="/img/promotion/check-in-title.png" alt="" />
      <AppImgVip class="current" :vipLevel="userLevel" />
      <div class="teb-wrapper">
        <AppVipTab @change="tabChange" :userLevel="userLevel" :list="levelList" />
      </div>

      <div class="day-list">
        <div class="day-item" v-for="i in 7" :key="i" :class="{ signed: i <= lastSignDay && currentVip === userLevel }">
          <header>Dia {{ i }}</header>
          <div class="body">
            <AppImage src="/img/promotion/coins.png" alt="" />
            <span>R${{ toDecimal(amountData ? amountData[`sign${i}_amount`] : 0, 0) }}</span>
          </div>
        </div>
      </div>

      <div class="rules">
        <h5> Regras de recompensa diária VIP:</h5>
        <p> Cada nível só pode receber recompensas por 7 dias no total. As recompensas serão creditadas na próxima vez
          que
          você as reivindicar.
          Para garantir a justiça da plataforma, a plataforma adota uma estratégia antitrapaça, os usuários trapaceiros
          serão banidos e forneceremos atendimento ao cliente 24 horas para resolver seus problemas.</p>
      </div>
      <AppButton width="426" height="134" special @click="checkIn"></AppButton>
      <div class="record" @click="goRecord">
        <span>visualizar registros</span>
        <AppImage src="/icons/i-arrowright-small.png" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
@import '../../theme/mixin.scss';

.check-in {
  width: 100%;
  height: 1563px;
  @include webp('/img/promotion/check-in-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
  padding-bottom: 100px;
}

.main {
  width: 100%;
  height: 1356px;
  @include webp('/img/promotion/check-in-box.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding-top: 24px;
  margin-top: 26px;

  .title {
    width: 464px;
    margin: 0 auto;
    display: block;
  }

  .current {
    margin: 73px auto 16px;
  }

  .teb-wrapper {
    width: 668px;
    padding-bottom: 11px;
    margin: 0 auto;
    overflow: hidden;

  }

  .day-list {
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    width: 668px;
    margin: 0 auto 37px;
    padding-top: 18px;
    overflow-x: auto;
    display: flex;
    padding-left: 15px;
    padding-right: 5px;
    box-sizing: border-box;

    .day-item {
      width: 150px;
      margin-right: 10px;
      flex-shrink: 0;

      header {
        font-size: 26px;
        line-height: 48px;
        text-align: center;
        height: 48px;
        border-radius: 16px 16px 0px 0px;
        background: linear-gradient(358deg, #1373EF 0%, #0ED1F4 100%), linear-gradient(180deg, #8B26EF 0%, #595DE3 100%);
      }

      .body {
        height: 138px;
        border-radius: 0px 0px 16px 16px;
        background-color: #BFF2FB;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 24px;
        color: #000;
        font-weight: 700;
        padding-top: 22px;

        img {
          width: 76px;
          margin-bottom: 18px;
        }

        span {
          white-space: nowrap;
        }
      }
    }

    .signed {
      filter: grayscale(0.5);

      img {
        filter: grayscale(1);
      }
    }
  }

  .rules {
    width: 648px;
    height: 418px;
    border-radius: 20px;
    background: linear-gradient(180deg, #044B9A 0%, #011A51 100%);
    margin: 0 auto 30px;
    box-sizing: border-box;
    padding: 30px 32px 0;


    h5 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      text-align: center;
    }

    p {
      font-size: 26px;
      font-weight: 400;
      line-height: 39px;
    }
  }

  .record {
    width: 300px;
    height: 33px;
    align-items: center;
    font-size: 28px;
    display: flex;
    justify-content: center;
    margin: 0 auto;

    img {
      height: 21px;
      width: auto;
      margin-left: 15px;
    }
  }
}
</style>
<style>
:root {
  --van-padding-sm: 24px;
  --van-padding-md: 32px;
}
</style>
