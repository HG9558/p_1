<script lang="ts" setup name="SafeCenter">
const router = useRouter()

const appStore = useAppStore()
const { userInfo, userBanks } = storeToRefs(appStore)
appStore.runGetMemberInfo()

const menus = computed(() => {
  const arr = [
    { id: '1', path: '/safe-center/account-info', icon: 'i-set-info', title: 'Informações pessoais', subTitle: 'Informações pessoais completas.', done: userInfo.value.phone && userInfo.value.email && userInfo.value.telegram, edit: false },
    { id: '2', path: '/safe-center/reset-pwd', icon: 'i-set-pwd', title: 'Alterar senha de entrar', subTitle: 'Combinação recomendada de letras e números', done: true, edit: true },
    { id: '4', path: '/safe-center/banks', icon: 'i-set-bank', title: 'Número da conta bancária', subTitle: 'Adicionar número de conta bancária', done: userBanks.value.length >= 5, edit: false },
    { id: '5', path: '/safe-center/verify-check', icon: 'i-set-code', title: 'Verificação de telefone', subTitle: 'Verificação de telefone', done: userInfo.value.phone_verify && +userInfo.value.phone_verify === 1, edit: false },
    { id: '6', path: '/safe-center/verify-check', icon: 'i-set-email', title: 'Verificação de email', subTitle: 'Verificação de email', done: userInfo.value.email_verify && +userInfo.value.email_verify === 1, edit: false },
  ]
  return arr
})

const menuClick = (item: any) => {
  if (item.id === '5' || item.id === '6') {
    if (item.done) {
      showToast('Se você precisar modificar a encadernação, entre em contato com o atendimento ao cliente')
      return
    }
  }
  if (item.path) {
    router.push(item.path)
  }
}

</script>

<template>
  <div class="safe-center-page">
    <AppHeader left-arrow title="Centro de Segurança" placeholder />
    <section>
      <ul class="panel">
        <li v-for="item in menus" class="item" @click="() => menuClick(item)">
          <div class="left">
            <AppImage :src="'/icons/'+item.icon+'.png'" />
          </div>
          <div class="mid">
            <h3>{{ item.title }}</h3>
            <p>{{ item.subTitle }}</p>
          </div>
          <div class="right">
            <AppImage class="check" :class="{done: item.done}" src="/icons/i-radio-active.png" />
            <AppImage class="edit" :class="{done: item.done, 'show-edit': item.edit}" src="/icons/i-set-edit.png" />
            <AppImage class="arrow" :class="{done: item.done, 'show-arrow': item.edit}" src="/icons/i-arrow-right-bold.png.webp" />
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .safe-center-page {
    padding: 30px 45px 0;
    .panel {
      border-radius: 20px;
      background: linear-gradient(180deg, #044B9A 0%, #011A51 100%);
      .item {
        height: 150px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.25);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &:last-child {
          border-bottom: 0;
        }
        .left {
          padding-left: 14px;
          padding-right: 13px;
          img {
            width: 90px;
          }
        }
        .mid {
          width: 388px;
          h3 {
            color: #FFF;
            font-size: 28px;
            font-weight: 400;
            line-height: 32px;
            margin-bottom: 8px;
          }
          p {
            color: rgba(255, 255, 255, 0.70);
            font-size: 24px;
            font-weight: 400;
            line-height: 28px;
          }
        }
        .right {
          flex: 1;
          padding-right: 26px;
          display: flex;
          align-items: center;
          gap: 14px;
          justify-content: flex-end;
          img {
            width: 32px;
          }
          img.arrow {
            width: 20px;
          }
          .check {
            opacity: 0;
          }
          .check.done {
            opacity: 1;
          }
          .arrow {
            opacity: 1;
          }
          .arrow.done {
            opacity: 0;
          }
          .arrow.show-arrow {
            opacity: 1;
          }
          .edit.done {
            opacity: 0;
          }
          .edit.show-edit {
            opacity: 1;
          }
        }
      }
    }
  }
</style>
