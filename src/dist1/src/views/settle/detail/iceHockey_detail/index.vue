<template>
  <div class="main tennis_container">
    <!-- -盘口详情 -->
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
      :allSettleLoading="allSettleLoading"
    />

    <PureTableBar :columns="columns" @refresh="onSearch()">
      <template #title>
        <div>
          <h2>{{ t('赛果结算') }}</h2>
        </div>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          :loading="loading"
          :size="size"
          :row-key="row => row.inningNum"
          :adaptiveConfig="{
            offsetBottom: 60
          }"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="tableHeaderStyle"
        >
          <!-- -比分 -->
          <template #t1="{ row }">
            <Score :row="row" type="t1" :errorType="row.t1Error" />
          </template>
          <template #t2="{ row }">
            <Score :row="row" type="t2" :errorType="row.t2Error" />
          </template>
          <template #inningNum>
            <!-- {{boardType === 'INNING' ? t('节') : t('上/下半场') }} -->
            {{ t('局') }}
          </template>
          <!-- -结算时间 -->
          <template #eventTime="{ row, index }">
            <EventTime
              :row="row"
              :index="index"
              :dataList="dataList"
              :errorType="row.eventTimeError"
            />
          </template>

          <!-- -局按钮 -->
          <template #operation="{ row, index }">
            <ChildOperation
              :row="row"
              :childIndex="index"
              @deleteChildItem="() => dataList.pop()"
              @settlementHandicap="settlementHandicap(row)"
            />
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <template v-if="renderObj.fullSettlementStatus !== 1 && checkNoMore()">
      <div class="mt-4">
        <el-button type="primary" @click="addEventRow">
          {{ dataList.length == 3 ? t('新增加时赛') : t('新增局') }}</el-button
        >
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { usePublicHooks } from '@/hooks';
import { PureTableBar } from '@/components/RePureTableBar';
import DetiltTitle from './component/DetailTitle.vue';
import { useDetailHook } from './utils/hook';
import { t } from '@/plugins/i18n';
import Score from './component/Score.vue';
import EventTime from './component/EventTime.vue';
import ChildOperation from './component/ChildOperation.vue';

defineOptions({ name: 'SETTLE_ICEHOCKEY_DETAIL' });
const { tableHeaderStyle } = usePublicHooks();

const {
  onSearch,
  loading,
  columns,
  dataList,
  // boardType,
  addEventRow,
  settlementHandicap,
  allSettleBtnClick,
  renderObj,
  allSettleLoading,
  checkNoMore
} = useDetailHook();
</script>
