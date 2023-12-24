<script lang="ts" setup>
const router = useRouter()

const progress = computed(() => {
  if (userInfo.value && userInfo.value.deposit_amount && userInfo.value.next_deposit && userInfo.value.deposit_amount >= 0 && +userInfo.value.next_deposit > 0) {
    const num = userInfo.value.deposit_amount / +userInfo.value.next_deposit * 100
    return num >= 100 ? 100 : (num).toFixed(2)
  }
  return 0
});

const logout = () => {
  if (loading.value) return
  runLogout()
}

// 退出
const { run: runLogout, loading } = useRequest(ApiLogout, {
  manual: true,
  loadingDelay: 500,
  onSuccess(data) {
    localStorage.clear()
    location.replace(location.origin)
  }
})

const records = ref([
  { icon: 'i-finance-record', text: 'Transação', path: '/record-list/transaction', iconWidth: 0 }, // icon 图标从 figma 导出 x3 倍图
  { icon: 'i-agent-record', text: 'Histórico de Apostas', path: '/record-list/apostas', iconWidth: 0 },
  { icon: 'i-gift-record', text: 'Histórico de Recompensas', path: '/record-list/recompensas', iconWidth: 0 },
  { icon: 'i-userinfo-center', text: 'Configurações De Conta', path: '/safe-center', iconWidth: 0 },
  // { icon: 'i-bet-record', text: 'Histórico de bônus', path: '/record-list/bonus', iconWidth: 0 },
  { icon: 'i-logout', text: 'Sair', iconWidth: 0, fn: logout }
])

const appStore = useAppStore()
const { userInfo, loadingBalance, loadingUserinfo } = storeToRefs(appStore)
const avatarImg = computed(() => userInfo.value.avatar ?? '0')
const vipImg = computed(() => userInfo.value.vip ?? '0')

const loadingRefresh = ref(false)

const refreshBalance = () => {
  loadingRefresh.value = true
  appStore.runGetMemberInfo()
  setTimeout(() => {
    loadingRefresh.value = false
  }, 1500);
}

const recordClick = (item: any) => {
  if (item.fn) {
    item.fn()
    return
  }
  if (item.path) {
    router.push(item.path)
  }
}

const iconLoad = (e: any, item: any) => {
  for (let i = 0; i < records.value.length; i++) {
    if (item.icon === records.value[i].icon) {
      records.value[i].iconWidth = Math.ceil(e.target.naturalWidth / 3)
      break
    }
  }
}

const copyName = () => {
  copy(userInfo.value.username || '')
  showToast('Copied!')
}

onMounted(() => {
  runGetProSignConf()
})

const openAvatar = () => {
  appStore.setEditAvatarDialogVisble(true)
}

const { run: runGetProSignConf, data: signProData } = useRequest(ApiGetPromotionSignConfig, {
  manual: true
})
const signProBonus = computed(() => {
  if (signProData.value && signProData.value.length) {
    const temp: any = signProData.value.filter((i: any) => +i.vip === userInfo.value.vip)[0]
    if (temp) {
      let t = 0
      for (let i = 1; i < 8; i++) {
        t += Number(temp['sign' + i + '_amount'])
      }
      return t
    }
  }
  return 0;
})
</script>

<template>
  <div class="personal-page">
    <AppHeader left-arrow title="Minha conta" background="transparent" title-weight="700" />
    <section class="content">
      <div class="user-info-box-outer">
        <div class="user-info-box">
          <!-- <div class="tag">
            <AppImage src="/icons/i-calendar.png" />
            <span>Entrar</span>
            <AppImage src="/icons/i-arrowright-small.png" />
          </div> -->

          <div class="panel">
            <div class="top">
              <div class="profile">
                <AppImage class="avatar" :src="`/img/avatar/avatar${avatarImg}.png`" @click="openAvatar" />
                <!-- <div class="vip-badge">
                  <AppImage src="/img/vip.png" />
                  <AppImage src="/img/vip0.png" />
                </div> -->
                <!-- <AppImgVip :vip-level="0" :img-height="80" /> -->
                <AppImage class="vipimg" :src="`/img/vip/vip-${vipImg}.png`" />
              </div>
              <div class="detail">
                <div class="nick-name"> <span>ID:{{ userInfo.uid }}</span></div>
                <div class="user-name"><span class="label">Nome do usuário:</span><span class="copy-txt"><span>{{
                  userInfo.username }}</span>
                    <AppImage src="/icons/i-copy-white.png" @click="copyName" />
                  </span></div>
                <div class="money"><span>R$</span><span class="num">{{ toDecimal(userInfo.brl || 0) }}</span>
                  <AppImage class="refresh-img" :class="{ 'rotate': loading || loadingBalance || loadingUserinfo }"
                    src="/icons/i-refresh-money.png" @click="refreshBalance" />
                </div>
              </div>
            </div>
            <div class="vip-progress">
              <div class="tip">Benefícios
                <AppImage src="/icons/i-round-arrowr.png" @click="$router.push('/vip')" />
              </div>
              <div class="pro">
                <AppProgress :value="progress" :max="100" />
              </div>
              <div><span>{{ toDecimal(userInfo.deposit_amount || 0) }}</span><span class="divider">/</span><span>{{ toDecimal(userInfo.next_deposit || 0)
              }}</span></div>
            </div>
            <div class="bot-btn">
              <AppButton fontSize="28" radius="28" bold whiteText yellowToRight width="180" height="54"
                @click="$router.push('/finance?tab=deposit')">Depósito</AppButton>
              <AppButton fontSize="28" radius="28" bold whiteText blueToRight width="150" height="54"
                @click="$router.push('/finance?tab=withdraw')">Retirar</AppButton>
            </div>
          </div>
        </div>
      </div>

      <div class="bonus-good">
        <AppImage src="/img/bonusgood.png" />
        <div>
          Recompensa total de check-in de 7 dias: <span>R$ {{ toDecimal(signProBonus) }}</span>
        </div>
      </div>

      <ul class="reports">
        <li v-for="(item, idx) in records" :key="item.icon" class="item" @click="() => recordClick(item)">
          <div class="icon">
            <AppImage :src="'/icons/' + item.icon + '.png'"
              :style="{ width: item.iconWidth ? 'var(--app-px-' + item.iconWidth + ')' : '0' }"
              @load="$event => iconLoad($event, item)" />
          </div>
          <span>{{ item.text }}</span>
          <AppImage class="arrow" :src="idx === records.length - 1 ? '/icons/i-arrow-right-grey.png' : '/icons/i-arrow-right-bold.png'" />
        </li>
      </ul>

      <!-- <div class="pt-30">
        <AppButton :loading="loading" fontSize="28" radius="45" bold whiteText blueToRight width="580" height="90" center
          @click="runLogout">Sair</AppButton>
      </div> -->
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import '../../theme/mixin.scss';

.pt-30 {
  padding-top: 30px;
}

.refresh-img {
  &.rotate {
    animation: spin 1s linear infinite;
  }
}

.bonus-good {
  display: flex;
  align-items: center;
  color: #FFF;
  font-size: 28px;
  font-weight: 400;
  line-height: 32px;
  padding: 30px 97px 30px 74px;

  img {
    width: 152px;
    margin-right: 44px;
  }

  span {
    color: #0ED1F4;
    font-weight: 700;
  }
}

.personal-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding-top: 112px;
  padding-bottom: 132px;
  // background: url() no-repeat, ;
  background-color: #000A1D;
  @include webp('/img/user-center-bg.png');
  background-position: 0 0;
  background-size: 100% auto;
  .user-info-box-outer {
    margin-left: 45px;
    width: 705px;
    border-radius: 24px 0px 0px 24px;
    box-sizing: border-box;
    background: linear-gradient(360deg, #044B9A 0%, #1373EF 53.65%, #0ED1F4 100%), linear-gradient(135deg, #F1F9FF 0%, #B3BCC8 100%);
  }
  .user-info-box {
    position: relative;
    display: flex;
    align-items: stretch;
    min-height: 360px;
    padding: 20px 21px 0 24px;
    // background: no-repeat 100% 52px/251px auto url('/img/user-star.png');
    @include webp('/img/user-star.png');
    background-size: 251px auto;
    background-position: 100% 52px;
    .tag {
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 0px 0px 0px 100px;
      background: linear-gradient(143deg, #FA3A68 0%, #BD0C36 100%);
      width: 220px;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 24px;
      gap: 28px;
      color: #FFF;
      font-size: 24px;

      img:nth-of-type(1) {
        width: 28px;
      }

      img:nth-of-type(2) {
        width: 12px;
      }
    }

    .panel {
      flex: 1;
      // background: url() no-repeat;
      @include webp('/img/broken-rect.png');
      background-size: 100% 100%;
      background-position: 0 0;
      padding: 12px 28px 28px;
      overflow: hidden;

      .top {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 24px;

        .profile {
          .avatar {
            width: 114px;
            margin: 0 auto;
            display: block;
          }

          .vipimg {
            width: 128px;
            display: block;
            margin-top: -16px;
          }
        }

        .detail {
          color: #fff;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;

          >div {
            display: flex;
            align-items: center;
            justify-content: flex-start;
          }

          .nick-name {
            font-size: 28px;
            font-weight: 700;
            padding-top: 4px;

            img {
              width: 27px;
              margin-left: 12px;
            }
          }

          .user-name {
            color: #FFF;
            font-size: 26px;
            font-weight: normal;
            margin: 5px 0 1px;

            .label {
              margin-right: 8px;
            }

            .copy-txt {
              display: flex;
              align-items: center;
              border-radius: 50px;
              background: rgba(0, 0, 0, 0.25);
              height: 46px;
              line-height: 46px;
              padding: 0 18px;
              white-space: nowrap;
              overflow: hidden;
              span {
                display: block;
                flex: 1;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              img {
                width: 24px;
                height: 29px;
                margin-left: 12px;
              }
            }
          }

          .money {
            color: #FFF;
            font-size: 42px;
            font-weight: 700;

            .num {
              padding-left: 10px;
              padding-right: 8px;
            }

            img {
              width: 49px;
            }
          }
        }
      }
    }
  }
}

.vip-badge {
  width: 120px;
  height: 80px;
  // background: url() no-repeat;
  @include webp('/img/vipbadge.png');
  background-size: 100% 100%;
  background-position: 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -34px;
  z-index: 5;
  position: relative;

  img:nth-of-type(1) {
    width: 34px;
  }

  img:nth-of-type(2) {
    width: 15px;
  }
}

.vip-progress {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #FFF;
  font-size: 26px;
  margin-top: 40px;
  margin-bottom: 30px;

  .pro {
    flex: 1;
    margin-right: 15px;
  }

  .tip {
    position: absolute;
    right: 0;
    top: -36px;
    font-size: 24px;
    display: flex;
    align-items: center;

    img {
      width: 27px;
      margin-left: 10px;
    }
  }

  .divider {
    padding: 0 8px;
  }
}

.bot-btn {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
}

.reports {
  margin: 0 auto;
  // margin-top: 50px;
  padding: 0;
  list-style: none;
  border-radius: 20px;
  background: linear-gradient(180deg, #044B9A 0%, #011A51 100%);
  width: 660px;
  color: #FFF;
  font-size: 28px;

  .item {
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 90px;

    .icon {
      width: 92px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:last-child {
      border: 0;
    }

    .arrow {
      width: 20px;
      position: absolute;
      top: 50%;
      right: 28px;
      transform: translateY(-50%);
    }
  }
  .item:last-child {
    color: rgba(255, 255, 255, 0.50);
  }
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
