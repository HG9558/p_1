import dayjs from "dayjs";

export const MATCH_PERIOD_TYPES = {
  Q1: t('第一节'),
  Q2: t('第二节'),
  Q3: t('第三节'),
  Q4: t('第四节'),
  OT: t('加时赛'),
  HT: t('上半场'),
  FT: t('下半场'),
}
export const MATCH_PERIOD = {
  'INNING': {
    1: 'Q1',
    2: 'Q2',
    3: 'Q3',
    4: 'Q4',
    5: 'OT',
  },
  'HT': {
    1: 'HT',
    2: 'FT',
    3: 'OT'
  }
}
export const columns: TableColumnList = [
  {
    headerSlot: 'inningNum',
    formatter: ({matchPeriod}) => MATCH_PERIOD_TYPES[matchPeriod] ?? '-' 
  },
  {
    headerRenderer: () => history.state.params.homeTeamNameCn ?? '_',
    slot: 't1'
  },
  {
    headerRenderer: () => history.state.params.awayTeamNameCn ?? '_',
    slot: 't2'
  },
  {
    label: t('结算时间'),
    slot: 'eventTime'
  },
  {
    label: t('操作人'),
    formatter: ({ createdBy }) => {
      return createdBy ? createdBy : '_';
    }
  },
  {
    label: t('状态'),
    formatter: () => {
      return t('人工结算');
    }
  },
  {
    label: t('确认时间'),
    formatter: ({ id, updatedAt }) => {
      return id ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss') : '_';
    }
  },
  {
    label: t('操作'),
    slot: 'operation',
    width: 260
  }
];