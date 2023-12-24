<script setup lang='ts'>
interface AppTableProps {
  data: AppTableRowProps[];
  cols: AppTableCol[];
  local: number //由于表头是fixed定位固定，需要确定表头位置；
  formData?: Record<string, any>
  loading?: boolean
  finished?: boolean
}
interface AppTableRowProps {
  [key: string]: string
}
interface AppTableCol {
  title: string,
  key: string,
}
const props = defineProps<AppTableProps>();
const emit = defineEmits(['loadMoreData'])

const loadMoreData = () => {
  emit('loadMoreData')
}
</script>

<template>
  <div>
    <!-- <AppList :loading="loading" :finished="finished" @refresh="refresh" @loadMoreData="loadMoreData" > -->
    <div class='c-app-table' v-if="data.length > 0">
      <div class="table-head" :style="{ top: $toPx(local) }">
        <div class="table-head-bg">
          <div class="table-head-bg2 table-row">
            <div v-for="col of cols" :style="{ width: (100 / cols.length) + '%' }">
              <div>
                <span v-html="col.title" class="cles-3"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppList class="table-body" disabledPullRefresh :loading="loading" :finished="finished"
        @loadMoreData="loadMoreData">
        <div class="table-hidden-row">
          <div v-for="col, i of cols" :style="{ width: (100 / cols.length) + '%' }" :key="i">
            <div>
            </div>
          </div>
        </div>
        <div class="table-row" v-for="row in  data">
          <div v-for="col, i of cols" :style="{ width: (100 / cols.length) + '%' }" :key="i">
            <div>
              <span class="cles-3">{{ row[col.key] }}</span>
            </div>
          </div>
        </div>
      </AppList>
    </div>
    <app-empty v-else />
  </div>
</template>

<style lang='scss' scoped>
.c-app-table {
  background: var(--app-table-bg);
  border: 1px solid var(--app-table-border);
  border-radius: 0 0 20px 20px;

  .table-head {
    position: fixed;
    top: 316px;
    z-index: 11;
    background: rgba(0, 10, 29, 1);
    left: 0;
    right: 0;
    color: #fff;

    .table-head-bg {
      padding: 0 16px;
      background: rgba(217, 217, 217, 0.1);
    }

    .table-head-bg2 {
      border-radius: 20px 20px 0 0;
      background: var(--app-table-bg);
      border: 1px solid var(--app-table-border);
      border-bottom: 0;
    }
  }



  .table-body {
    .table-row:nth-of-type(odd) {
      background: #D9D9D91A;
    }
  }

  .cles-3 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
  }

  .table-row {
    display: flex;
    text-align: center;
    align-items: center;
    height: 94px;
    font-size: 24px;
    color: var(--app-text-color);

    >div {
      flex-grow: 1;
      flex-shrink: 0;
      box-sizing: border-box;
      overflow: hidden;

      >div {
        height: 94px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    div+div {
      border-left: 1px solid rgba(255, 255, 255, 0.25);
    }
  }

  .table-hidden-row {
    @extend .table-row;
    background: none !important;
  }
}
</style>
