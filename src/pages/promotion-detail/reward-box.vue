<script setup lang='ts' name='reward-box'>
const router = useRouter()
const appStore = useAppStore()
const { userInfo, isLogin, isApp, token } = storeToRefs(appStore)
const inviteNum = computed(() => userInfo.value.invite_num ?? 0)
const lastTreasure = computed(() => userInfo.value.last_treasure ?? 0)

const { data: rewardList } = useRequest(ApiGetRewardBoxConfig)
const curentBox = computed(() => {
  const boxObj = rewardList.value?.find((a) => a.invite_num > lastTreasure.value)

  if (boxObj) {
    const amount = inviteNum.value >= boxObj.invite_num ? boxObj.amount : 0
    return { invite_num: inviteNum.value, amount, apply_num: boxObj.invite_num }
  }
  else {
    return { invite_num: inviteNum.value, amount: 0, apply_num: 0 }
  }
})

const { data: record, run: runGetRecord } = useRequest(ApiGetRewardBoxRecord, { ready: isLogin, })

const applyInviteNum = ref(0)
const { run: runApply, loading } = useRequest(() => ApiApplyRewardBox(applyInviteNum.value), {
  manual: true,
  onSuccess() {
    showToast('Aplicação Bem Sucedida')
    appStore.runGetMemberInfo()
    runGetRecord()
  }
})

const handlApply = () => {
  if (!isLogin.value) return openLoginDialog()

  console.log("🔰🔰🔰 ~ curentBox:", curentBox.value)
  if (curentBox.value.amount === 0) {
    showToast('Atualmente não há baús de tesouro para reivindicar')
    return
  }
  applyInviteNum.value = curentBox.value.apply_num
  runApply()
}
</script>
<template>
  <div class="reward-box">
    <div class="banner" :style="{
      paddingTop: isApp ? 'var(--app-px-30)' : '',
      height: isApp ? 'var(--app-px-670)' : ''
    }">
      <AppHeader title="Jackpot de desempacotar" leftArrow :placeholder="true" />
      <AppImage class="title" src="/img/promotion/reward-title.png" alt="" />
      <p class="text1">Convide amigos para atingir o número especificado para resgatar recompensas.</p>
      <div class="info">
        <div class="item">
          <label>Convidado: </label>
          <span class="money-text">{{ curentBox.invite_num }}</span>
        </div>
        <div class="item">
          <label>Premiado: </label>
          <span class="money-text">R${{ toDecimal(curentBox.amount, 0) }}</span>
        </div>
      </div>

      <div class="box-wrapper">
        <div class="box-item" v-for="item, i in rewardList" :key="i">
          <span class="money">+R${{ toDecimal(item.amount, 0) }}</span>
          <div class="box">
            <AppImage src="/img/promotion/reward-box.png" alt="" />
            <span class="line"></span>
          </div>
          <div class="people">
            <AppImage class="icon" src="/icons/i-group.png" alt="" />
            <span>{{ item.invite_num }}</span>
          </div>
        </div>
      </div>
      <AppButton :loading="loading" @click="handlApply" width="354" height="90" yellow-to-right bold center round
        white-text>Receber prêmio
      </AppButton>
    </div>

    <div class="content">
      <p> Vá para a página de convite, copie o link e envie para outras pessoas para convidar amigos para participar do
        evento e receber dinheiro real</p>
      <AppButton @click="router.push(`/promotion-detail/invite${isApp ? `?is-app=1&t=${token}` : ''}`)" width="278"
        height="72" radius="16" blue-to-bottom shadow center white-text>
        <div style="display: flex;justify-content: center;align-items: center;">
          <span style="font-size: var(--app-px-28);">Ir para convidar</span>
          <AppImage src="/icons/i-arrowright-small.png"
            style="height: var(--app-px-21);width: auto;margin-left: var(--app-px-15);" alt="" />
        </div>
      </AppButton>
    </div>

    <div class="des">
      <label>Regras de atividade</label>
      <p> 1. Convide um número suficiente de usuários válidos (os clientes devem preencher o número do celular para se
        registrar e concluir a recarga) para receber recompensas</p>
      <p> 2. As recompensas chegarão diretamente ao saldo da sua conta e você poderá retirar mais lucros nas transações do
        jogo.</p>
      <p> 3. O usuário convidado deve ser real. Caso a plataforma detecte trapaça, os usuários convidados serão
        invalidados, e se a fraude for grave, a conta será suspensa.</p>
      <p> 4. As recompensas por convidar o número correspondente de pessoas são as seguintes:</p>
      <div class="table-wrapper">
        <table>
          <colgroup>
            <col style="width:var(--app-px-220);">
            <col style="width:var(--app-px-217);">
            <col style="width:var(--app-px-2221);">
          </colgroup>
          <thead>
            <tr>
              <th>Quantidade</th>
              <th>Prêmio</th>
              <th>Total geral</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item, i in rewardList" :key="i">
              <td class="money-text">{{ item.invite_num }} pessoas</td>
              <td class="money-text">R${{ toDecimal(item.amount, 0) }}</td>
              <td class="money-text">R${{ toDecimal(item.total_amount, 0) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="record">
      <label>Registro de unboxing</label>
      <div v-if="record && record.length > 0" class="record-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Aberto</th>
              <th>Tempo</th>
              <th>Prêmio</th>
            </tr>
          </thead>
          <tbody>
            <tr class="data-item" v-for="r in record" :key="r.id">
              <td>{{ r.invite_num }}</td>
              <td>
                {{ timestamp2Date(r.created_at * 1000, 'YYYY-MM-DD') }}<br />
                {{ timestamp2Date(r.created_at * 1000, 'hh:mm:ss') }}
              </td>
              <td>{{ toDecimal(r.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <AppEmpty v-else :padding-top="99">Nada aqui</AppEmpty>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.reward-box {
  color: #fff;
  background-color: #000A1E;
  padding-bottom: 150px;
}

.banner {
  width: 100%;
  height: 780px;
  background: linear-gradient(360deg, #044B9A 0%, #011A51 100%), linear-gradient(180deg, #2F8DF2 0%, #8012E3 100%);
  color: #fff;
  font-size: 28px;
  margin-bottom: 23px;

  .title {
    width: 100%;
    margin-bottom: 28.73px;
    margin-top: 20px;
  }

  .text1 {
    width: 692px;
    line-height: 33.89px;
    height: 80px;
    text-align: center;
    margin: 0 auto 8px;
  }

  .info {
    display: flex;
    justify-content: center;
    margin-bottom: 31px;

    .item {
      width: 320px;
      height: 53px;
      line-height: 53px;
      text-align: center;
      flex-shrink: 0;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.50) 49.48%, rgba(255, 255, 255, 0.00) 100%);

      &:nth-of-type(1) {
        margin-right: 36px;
      }
    }
  }

  .box-wrapper {
    width: 100%;
    overflow-x: auto;
    padding: 0 30px;
    box-sizing: border-box;
    display: flex;
    margin-bottom: 31px;

    .box-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 99.2px;
      margin-right: 49.8px;

      .box {
        margin-bottom: 13px;
        position: relative;
        width: 99.2px;
        height: 88px;

        img {
          width: 99.2px;
          height: auto;
          position: absolute;
          z-index: 1;
        }

        .line {
          display: block;
          height: 10px;
          width: 150px;
          background-color: rgba(255, 255, 255, 0.25);
          position: absolute;
          top: 50%;
          left: 20px;
        }
      }

      .money {
        color: #0ED1F4;
        font-size: 28px;
      }

      .people {
        display: flex;
        justify-content: center;
        font-size: 26px;
        width: 99.2px;
        height: 31px;
        align-items: center;

        .icon {
          flex-shrink: 0;
          height: 20px;
          width: auto;
          margin-right: 9.8px;
        }
      }

      &:last-of-type {
        margin-right: 0;

        .box {
          .line {
            display: none;
          }
        }
      }
    }
  }
}

.content {
  width: 749px;
  height: 264px;
  background: linear-gradient(180deg, #011A51 0%, rgba(1, 26, 81, 0.00) 100%);
  padding-top: 34px;
  margin-bottom: 16px;
  box-sizing: border-box;

  p {
    width: 670px;
    height: 114px;
    font-size: 28px;
    line-height: 32.81px;
    text-align: center;
    margin: 0 auto 15px;
  }
}

.des {
  margin: 0 auto 48px;
  width: 710px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(4, 75, 154, 0.30) 0%, rgba(1, 26, 81, 0.30) 100%);
  padding: 27px 25px 26px;
  box-sizing: border-box;
  font-size: 26px;

  label {
    margin-bottom: 17px;
    display: block;
  }

  p {
    line-height: 30.47px;
    margin-bottom: 15px;
  }

  .table-wrapper {
    border: 1px solid #FFFFFF40;
    border-radius: 8px;

    table {
      width: 660px;
      margin: 0 auto;
      border-collapse: collapse;

      tbody {
        tr {
          &:nth-of-type(odd) {
            background-color: rgba(4, 75, 154, 0.20);
          }
        }
      }



      th,
      td {
        height: 50px;
        border-right: 1px solid #FFFFFF40;
        text-align: center;

        &:nth-of-type(3) {
          border: none;
        }
      }

      th {
        font-weight: 400;
      }
    }
  }
}

.record {
  width: 100%;
  padding: 0 21px;

  label {
    font-size: 32px;
  }

  .record-table-wrapper {
    margin-top: 30px;
    width: 710px;
    border-radius: 20px;
    border: 1px solid rgba(14, 209, 244, 0.25);
    background: linear-gradient(180deg, rgba(4, 75, 154, 0.70) 0%, rgba(1, 26, 81, 0.70) 100%);
    font-size: 24px;

    table {
      table-layout: fixed;
      border-collapse: collapse;

      width: 100%;

      tr {
        height: 94px;
      }

      th,
      td {
        text-align: center;
        border-right: 1px solid #FFFFFF40;

        &:last-of-type {
          border: none;
        }
      }

      .data-item {
        &:nth-of-type(odd) {
          background-color: rgba(217, 217, 217, 0.10);
          ;
        }
      }
    }
  }
}
</style>
