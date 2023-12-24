<script setup lang='ts' name='checkin-record'>
const { isApp } = storeToRefs(useAppStore())
const { data } = useRequest(ApiGetSignRewardRecord)
</script>
<template>
  <AppHeader leftArrow title="Coletar cupons" :placeholder="true" />
  <template v-if="data && data.length > 0">
    <div class="table-head-wrapper" :style="{ top: isApp ? 0 : '' }">
      <div class="table-head">
        <div class="th">ID</div>
        <div class="th">Nivel
          VIP</div>
        <div class="th">Coleta
          contínua</div>
        <div class="th">Obter
          recompensas</div>
        <div class="th">Tempo</div>
      </div>
    </div>

    <div class="table-body-wrapper" :style="{ minHeight: isApp ? '100vh' : 0 }">
      <div class="table-body">
        <div class="tr" v-for="i in data" :key="i.id">
          <div class="td">{{ i.id.slice(-8) }}</div>
          <div class="td">{{ i.vip }}</div>
          <div class="td">{{ i.day }}dia</div>
          <div class="td">R${{ toDecimal(i.amount) }}</div>
          <div class="td">{{ timestamp2Date(i.created_at * 1000) }}</div>
        </div>
      </div>
    </div>
  </template>
  <AppEmpty v-else>Nada aqui</AppEmpty>
</template>

<style lang='scss' scoped>
.table-head-wrapper {
  width: 100%;
  height: 124px;
  background: #161F30;
  padding: 30px 20px 0;
  color: #fff;
  font-size: 24px;
  position: fixed;
  top: 110px;
  left: 0;

  .table-head {
    width: 100%;
    height: 94px;
    border-radius: 20px 20px 0 0;
    border: 1px solid rgba(14, 209, 244, 0.25);
    border-bottom: none;
    background: #0B3D79;
    display: flex;

    .th {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid rgba(255, 255, 255, 0.25);

      &:nth-of-type(1) {
        width: 144px;
      }

      &:nth-of-type(2) {
        width: 96px;
      }

      &:nth-of-type(3) {
        width: 136px;
      }

      &:nth-of-type(4) {
        width: 174px;
      }

      &:nth-of-type(5) {
        width: 160px;
        border: none;
      }
    }
  }
}

.table-body-wrapper {
  width: 100%;
  min-height: calc(100vh - 110px);
  background: rgba(217, 217, 217, 0.10);
  padding: 124px 20px 0;
  color: #fff;
  font-size: 24px;


  .table-body {
    width: 100%;
    border: 1px solid rgba(14, 209, 244, 0.25);
    border-top: none;
    border-radius: 0 0 20px 20px;
    background: linear-gradient(180deg, rgba(4, 75, 154, 0.70) 0%, rgba(1, 26, 81, 0.70) 100%);

    .tr {
      display: flex;

      &:nth-of-type(odd) {
        background: rgba(217, 217, 217, 0.10);
      }

      .td {
        height: 94px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid rgba(255, 255, 255, 0.25);

        &:nth-of-type(1) {
          width: 144px;
        }

        &:nth-of-type(2) {
          width: 96px;
        }

        &:nth-of-type(3) {
          width: 136px;
        }

        &:nth-of-type(4) {
          width: 174px;
        }

        &:nth-of-type(5) {
          width: 160px;
          border: none;
        }
      }
    }
  }
}
</style>
