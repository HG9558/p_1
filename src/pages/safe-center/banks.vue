<script lang="ts" setup name="Banks">
import { showFailToast } from 'vant';

const router = useRouter()

const appStore = useAppStore()
const { userInfo, userBanks } = storeToRefs(appStore)


const addBank = () => {
  // if (userInfo.value && userInfo.value.pay_password && +userInfo.value.pay_password !== 1) {
  //   showFailToast('Por favor, vincule a senha do fundo primeiro')
  //   router.push('/safe-center/bind-pay-pwd')
  //   return
  // }
  router.push('/safe-center/bind-bank')
}

</script>

<template>
  <div class="bank-list">
    <AppHeader left-arrow title="Número da conta bancária" placeholder />
    <section class="content">
      <p class="bank-num">Carteira digital({{ userBanks ? userBanks.length : '0' }}/5)</p>
      <template v-if="userBanks && userBanks.length">
        <ul class="bank-cards">
          <li v-for="item in userBanks" class="item" :key="item.id">
            <div class="num">{{ item.pix_id }}</div>
          </li>
        </ul>
      </template>
      <div v-else class="no-bank">
        <AppImage src="/img/no-bank.png" />
        <p>Conta vazia</p>
      </div>
      <div class="btn-box">
        <AppButton :disabled="userBanks && userBanks.length >= 5" fontSize="28" radius="45" bold whiteText blueToRight width="580" height="90" center @click="addBank">
          <div class="plus">
            <AppImage class="plus" src="/icons/i-plus.png" />
            <span>Número da conta bancária</span>
          </div>
        </AppButton>
        <div class="tip">Máximo 5 permitido</div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .plus {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    img {
      width: 32px;
    }
  }
  .bank-list {
    .content {
      .bank-num {
        color: #FFF;
        font-size: 28px;
        font-weight: 400;
        line-height: 32px;
        padding: 30px 20px;
      }
      .no-bank {
        text-align: center;
        p {
          color: rgba(255, 255, 255, 0.70);
          font-size: 26px;
          font-weight: 400;
          line-height: 30px;
        }
        img {
          width: 521px;
        }
      }
      .bank-cards {
        .item {
          width: 680px;
          height: 300px;
          background: url('/img/bank-bg.png.webp') no-repeat;
          background-size: 100% 100%;
          margin: 0 auto;
          margin-bottom: 30px;
          color: #FFF;
          text-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.20);
          font-size: 52px;
          font-weight: 400;
          line-height: 300px;
          padding-left: 172px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      .btn-box {
        padding-top: 50px;
        padding-bottom: 100px;
        .tip {
          color: rgba(255, 255, 255, 0.70);
          text-align: center;
          font-size: 26px;
          font-weight: 400;
          padding-top: 30px;
        }
      }
    }
  }
</style>
