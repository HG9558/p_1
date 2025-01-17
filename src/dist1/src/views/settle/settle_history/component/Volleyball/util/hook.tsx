import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { removeEmptyStringKeys } from '@/utils/utilFn';
import { columns } from './tableColumnList';
import { SPORT_TYPE, SearchFormType } from '../../../utils/type';
import { useMatchStore } from '@/store/match';
import { useSettingStoreHook } from '@/store/settings';

export function useTennisHook() {
  const dataList = reactive<SattleDataAPI.getSettlementDataList[]>([]);
  console.warn(dataList);
  const matchStore = useMatchStore();
  const form = ref<SearchFormType>({} as SearchFormType);
  const settingStore = useSettingStoreHook();

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: settingStore.settleHistoryPageInfo.page ?? 1
  });

  const handleTableWidthChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    onSearch();
  };

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    onSearch();
  };

  /** 搜索初始化 */
  const onSearch = async (type?: 'reload') => {
    try {
      if (type === 'reload') pagination.currentPage = 1;
      const data = removeEmptyStringKeys(form.value ?? {});
      matchStore.set_settleRequestLoading(true);
      const res: SattleDataAPI.getSettlementListRes =
        await API.getSettlementHistory({
          ...data,
          pageSize: pagination.pageSize,
          pageNum: pagination.currentPage,
          sportId: SPORT_TYPE.volleyball
        });
      matchStore.set_settleRequestLoading(false);
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      res.data.list.forEach(item => {
        item.isShowCancelBtn = +res.ts < +item.beginTimeLong;
      });
      dataList.push(...res.data.list);
      pagination.total = res.data.total;
      document
        .querySelector('.table_container .el-scrollbar__wrap')
        .scroll(0, 0);
    } catch (error) {
      matchStore.settleRequestLoading = false;
    }
  };

  onMounted(() => {
    onSearch();
  });

  return {
    onSearch,
    columns,
    form,
    dataList,
    pagination,
    handleTableWidthChange,
    handleCurrentChange
  };
}
