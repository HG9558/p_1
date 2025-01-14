import { RouteRecordName } from "vue-router";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
};

export type multiType = {
  path: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
  settlePageInfo: {
    page: number;
    matchType: number;
  }
  settleHistoryPageInfo: {
    page: number;
    matchType: number;
  }
};

export type userType = {
  roles?: Array<string>;
  verifyCode?: string;
  currentPage?: number;
  token: string;
  userInfo: UserAPI.Login_User
};

export type MatchType = {
  sportLeagueList: MetadataAPI.LeagueList[];
  esportLeagueList: MetadataAPI.LeagueList[];
  countryList: MetadataAPI.getCountryListType[];
  settleRequestLoading: boolean;
  sportId: number;

};
