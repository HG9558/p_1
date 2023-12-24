<script lang="ts" setup>
const { t } = useI18n()
const router = useRouter()

const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)

enum Menus {
  HOME = 'index',
  PROMOTION = 'promotion',
  DEPOSIT = 'finance-deposit',
  VIP = 'vip',
  PERSONAL = 'personal',
}

const homeAref = ref()
const promotionAref = ref()
const depositAref = ref()
const vipAref = ref()
const personalAref = ref()

const show = ref(false)

const menus = ref([
  { path: '/', name: Menus.HOME, eleref: homeAref, auth: false },
  { path: '/promotion', name: Menus.PROMOTION, eleref: promotionAref, auth: false },
  { path: '/finance', name: Menus.DEPOSIT, eleref: depositAref, auth: true },
  { path: '/vip', name: Menus.VIP, eleref: vipAref, auth: true },
  { path: '/personal', name: Menus.PERSONAL, eleref: personalAref, auth: true },
])

const activeMenu = ref()

const toggleAni = function (curref: any) {
  let beat = curref.classList.contains('ani-beat')
  if (beat) {
    curref.classList.remove('ani-beat')
    setTimeout(() => {
      curref.classList.add('ani-beat')
    }, 0);
  } else {
    curref.classList.add('ani-beat')
  }
}

const menuAClick = function (ty: Menus) {
  const item = menus.value.filter(i => i.name === ty)[0]
  if (item) {
    if (!item.auth || isLogin.value) {
      activeMenu.value = ty
      if (item.name !== Menus.DEPOSIT) {
        toggleAni(item.eleref)
      }
    }
    // if (item.auth && !isLogin)
    router.push(item.path)
  }
}

const getIcon = (ty: Menus) => {
  const obj = menus.value.filter(i => i.name === ty)[0]
  if (obj) {
    return activeMenu.value === obj.name ? '/icons/i-' + obj.name + '.png' : '/icons/i-' + obj.name + '-gray.png'
  }
  else return ''
}

const iconLoad = (e: any, ty: Menus) => {
  e.currentTarget.style.width = 'var(--app-px-' + Math.ceil(e.currentTarget.naturalWidth / 3) + ')';
}

onMounted(() => {
  setTimeout(() => {
    // show.value = true
  }, 0);
})

watch(router.currentRoute, (val, old) => {
  if (val && val.path) {
    const cur = menus.value.filter(i => i.path === val.path)[0]
    if (cur && cur.path === '/finance') {
      activeMenu.value = cur.name
      show.value = false
      return
    }
    if (cur) {
      activeMenu.value = cur.name
      show.value = true
    } else if (val.meta.layout === 'home') {
      activeMenu.value = Menus.HOME
      show.value = true
    } else {
      show.value = false
    }
  }
}, { immediate: true })
</script>

<template>
  <!-- <Transition name="fade"> -->
  <div v-if="show" class="app-footer animate__animated animate__fadeInUp">
    <ul class="menu">
      <li class="menu-item" :class="[activeMenu === Menus.HOME ? 'active' : '']">
        <a ref="homeAref" class="" @click="() => menuAClick(Menus.HOME)">
          <AppImage class="icon-img" :src="getIcon(Menus.HOME)" @load="$event => iconLoad($event, Menus.HOME)" />
          <span class="menu-title">{{ t('appfoooter.home') }}</span>
        </a>
      </li>
      <li class="menu-item" :class="[activeMenu === Menus.PROMOTION ? 'active' : '']">
        <a ref="promotionAref" class="" @click="() => menuAClick(Menus.PROMOTION)">
          <AppImage class="icon-img" :src="getIcon(Menus.PROMOTION)"
            @load="$event => iconLoad($event, Menus.PROMOTION)" />
          <span class="menu-title">{{ t('appfoooter.promotion') }}</span>
        </a>
      </li>
      <li class="menu-item deposit" :class="[activeMenu === Menus.DEPOSIT ? 'active' : '']">
        <a ref="depositAref" @click="() => menuAClick(Menus.DEPOSIT)">
          <div class="menu-icon icon-deposit">
            <AppImage src="/img/pig.png"
              class="animate__animated animate__heartBeat animate__delay-1s animate__infinite infinite animate__slower" />
          </div>
          <span class="menu-title deposit">{{ t('appfoooter.deposit') }}</span>
        </a>
      </li>
      <li class="menu-item" :class="[activeMenu === Menus.VIP ? 'active' : '']">
        <a ref="vipAref" @click="() => menuAClick(Menus.VIP)">
          <AppImage class="icon-img" :src="getIcon(Menus.VIP)" @load="$event => iconLoad($event, Menus.VIP)" />
          <span class="menu-title">{{ t('appfoooter.vip') }}</span>
        </a>
      </li>
      <li class="menu-item" :class="[activeMenu === Menus.PERSONAL ? 'active' : '']">
        <a ref="personalAref" @click="() => menuAClick(Menus.PERSONAL)">
          <AppImage class="icon-img" :src="getIcon(Menus.PERSONAL)" @load="$event => iconLoad($event, Menus.PERSONAL)" />
          <span class="menu-title">{{ t('appfoooter.personal') }}</span>
        </a>
      </li>
    </ul>
  </div>
  <!-- </Transition> -->
</template>

<style lang="scss" scoped>
@import '../theme/mixin.scss';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 1;
}

.icon-img {
  width: 0;
}

ul {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

.app-footer {
  z-index: 2;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 124px;
  // background: url() no-repeat 100%/100%;
  @include webp('/img/app-footer-bg.png');
  background-size: 100% 100%;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 22px;
  opacity: 0;

  ul {
    display: flex;
    width: 100%;
    height: 100%;

    li.menu-item {
      flex: 1 1 0%;

      &.deposit {
        a {
          justify-content: flex-start;
          margin-top: -8px;
        }
      }

      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        &.ani-beat {
          animation-name: aniBeat;
          animation-duration: 600ms;
          animation-timing-function: ease-in-out;
          animation-iteration-count: 1;
        }

        .menu-icon {
          // width: 46px;
          // height: 46px;
          margin: 0 auto;
          // margin-top: 24px;
        }

        .menu-title {
          margin-top: 14px;
          line-height: 26px;

          &.deposit {
            margin-top: 10px;
          }
        }

        // .icon-home {
        // background-image: url('/icons/i-home.png');
        // background-size: 46px auto;
        // background-repeat: no-repeat;
        // background-position: center center;
        // }

        .menu-icon.icon-deposit {
          width: 74px;
          height: 74px;
          margin-bottom: 4px;
          // background-image: url();
          @include webp('/img/blue-circle.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center center;

          img {
            width: 74px;
            vertical-align: top;
          }
        }
      }

      &.active {
        a {
          .menu-title {
            color: #0ED1F4;
          }
        }
      }
    }
  }
}

@keyframes aniBeat {
  0% {
    transform: scale(1);
  }

  40% {
    transform: scale(0.6);
  }

  60% {
    transform: scale(1.1);
  }

  80% {
    transform: scale(0.85);
  }

  100% {
    transform: scale(1);
  }
}
</style>
