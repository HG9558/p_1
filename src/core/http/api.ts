// 获取Token
export function ApiGetToken() {
  return request<{
    token: string;
  }>({
    url: "/token",
    method: "get",
  });
}

// 用户信息
export function ApiGetUserInfo() {
  return request<{
    age: number;
    name: string;
    profession: string;
  }>({
    url: "/getInfo",
    method: "get",
  });
}

/**
 * 登录
 * @returns
 */
// 登录
export const ApiLogin = (data: {
  username: string;
  password: string;
  device_no?: string;
  vid?: string;
  code?: string;
}) => request<string>({ url: "/member/login", method: "post", data });

/**
 * 用户信息
 */
// 获取会员资料
export const ApiGetMemberInfo = () =>
  request<{
    [text: string]: any;
    avatar: number | string; // 头像
    created_at: number; // 注册时间
    created_ip: string; // 注册IP
    deposit_amount: number; // 存款总额
    email: string; // 邮箱
    grand_id: string; // 曾祖父ID
    grand_name: string; // 曾祖父名称
    great_grand_id: string; // 祖父ID
    great_grand_name: string; // 祖父名称
    next_deposit: string; // 距离下一级存款金额
    next_level: number; // 距离下一级存款金额
    now_deposit: string; // 当前存款金额
    now_valid_amount: string; // 当前流水
    parent_id: string; // 父ID
    parent_name: string; // 父名称
    phone: string; // 手机号
    rate: string; // 存款比例
    score: number; // 积分
    top_id: string; // 顶级ID
    top_name: string; // 顶级名称
    uid: string; // 用户ID
    username: string; // 用户名
    vip: number; // VIP等级
    invite_num: number; // 邀请人数
    last_treasure: number; // 上一次申请的宝箱对应的邀请人数
    contate: string; // 小飞机频道
    invite_code: string; // 邀请码
    pay_password: string; // 支付密码
    telegram: string; // 小飞机
    phone_verify: string; // 手机是否验证 1是0否
    email_verify: string; // 邮箱是否验证 1是0否
  }>({ url: "/member/info" });

/**
 * 注册
 */
export function ApiRegister(data: {
  phone: string;
  password: string;
  confirm_phone: string;
  captcha: string;
  sid?: string;
  ts?: string;
  device_no?: string;
  link_id?: string;
  vid: string;
}) {
  return request<{
    token: string;
  }>({
    url: "/member/reg",
    method: "post",
    data,
  });
}

/**
 * @图形验证码获取
 */
export const getCaptcha = () => request({ url: "/member/captcha" });

// 邮箱注册
export const ApiEmailCode = (data: {
  mail: string;
  username?: string; // 忘记密码传
  ty: "1" | "2"; // 1 注册 2 忘记密码
}) => request<string>({ url: "/sms/send/mail", method: "post", data });

// 获取用户余额信息(中心钱包和锁定钱包)
export const ApiGetUserBalance = () =>
  request<{
    uid: string;
    brl: number;
    brl_amount: number;
    lockAmount: number;
    agencyAmount: number;
    deposit_amount: number;
    deposit_balance: number;
    depositLockAmount: number;
    agency_balance: number;
    agencyLockAmount: number;
  }>({ url: "/member/balance" });

// 发送离线验证码
export const ApiSendOfflineSms = (data: {
  tel: string;
  flag: "text" | "voice";
  ty: 1 | 2;
}) => request<string>({ url: "/sms/send", method: "post", data });

// 首页最新赢家列表
export const ApiGetMemerLastWin = () =>
  request<{}>({ url: "/member/lastwin", method: "get" });

// 公告
export const ApiGetMemerNotice = () =>
  request<
    | {
      id: string;
      title: string;
      content: string;
      redirect: string;
      redirect_url: string;
      state: string;
      created_at: number;
      created_uid: string;
      created_name: string;
    }[]
    | null
  >({ url: "/member/notice", method: "get" });

// Banner
export const ApiGetMemerBanner = () =>
  request<
    | {
      id: string;
      title: string;
      redirect_url: string;
      images: string;
      seq: number;
      url_type: number;
      updated_name: string;
      updated_uid: string;
      updated_at: number;
      state: string;
      created_at: number;
      h5img: string;
    }[]
    | null
  >({ url: "/member/banner", method: "get" });

// vip等级信息
export const ApiGetMemberVip = () =>
  request<
    {
      vip: number;
      name: string;
      deposit_amount: number;
      flow: number;
      amount: string;
      free_withdraw_num: number;
      withdraw_limit: number;
      rebate_rate: string;
      props: number;
      updated_at: number;
      created_at: number;
    }[]
  >({ url: "/member/vips" });

/* 💬 站内信 💬 */
// 列表
export const ApiGetMessageList = (params: {
  page: number;
  page_size: number;
}) =>
  request<{
    t: number;
    s: number;
    d: {
      id: string;
      ts: string;
      msg_id: string;
      username: string;
      title: string;
      content: string;
      is_top: number;
      is_vip: number;
      ty: number;
      is_read: number;
      send_name: string;
      send_at: number;
    }[];
  }>({ url: "/member/message/list", params });
// 读取
export const ApiReadMessage = (data: { id: string }) =>
  request({ url: "/member/message/read", method: "post", data });
// 删除
export const ApiDeleteMessage = (data: { ids: string }) =>
  request({
    url: "/member/message/delete",
    method: "post",
    data: { flag: 1, ...data },
  });

/* 🎪 活动 🎪 */
// 签到配置
export const ApiGetPromotionSignConfig = () =>
  request<
    {
      vip: number;
      sign1_amount: string;
      sign2_amount: string;
      sign3_amount: string;
      sign4_amount: string;
      sign5_amount: string;
      sign6_amount: string;
      sign7_amount: string;
    }[]
  >({ url: "/member/sign/config" });
// 签到状态
export const ApiGetPromotionSignRecord = () =>
  request<{
    uid: string;
    username: string;
    vip: number;
    sign1: string;
    sign2: string;
    sign3: string;
    sign4: string;
    sign5: string;
    sign6: string;
    sign7: string;
    last_sign: string;
  }>({ url: "/member/sign/record" });
// 进行签到
export const ApiMemberSign = (day: number) =>
  request({ url: "/member/sign", params: { day } });
// 签到记录
export const ApiGetSignRewardRecord = () =>
  request<
    {
      id: string;
      uid: string;
      username: string;
      vip: number;
      day: number;
      amount: string;
      created_at: number;
    }[]
  >({ url: "/member/sign/reward/record" });

// 宝箱配置
export const ApiGetRewardBoxConfig = () =>
  request<
    {
      id: string;
      invite_num: number;
      amount: string;
      total_amount: string;
    }[]
  >({ url: "/member/treasure/config" });
// 宝箱记录
export const ApiGetRewardBoxRecord = () =>
  request<
    {
      id: string;
      uid: string;
      username: string;
      invite_num: number;
      amount: string;
      created_at: number;
    }[]
  >({ url: "/member/treasure/record" });
// 宝箱申请
export const ApiApplyRewardBox = (invite_num: number) =>
  request({ url: "/member/treasure/apply", params: { invite_num } });

// 周投注活动
export const ApeGetRefundConfig = () =>
  request<{
    bonus_amount: number;
    config_list: {
      id: number;
      flow_amount: number;
      bonus_amount: number;
      updated_at: number;
      updated_name: string;
    }[];
  }>({ url: "/member/weekly/config" });

// 获取充值渠道
export const ApiGetDepositChannel = (params: {
  /** 1=存款 2=提现 */
  flag?: string; //
}) =>
  request<{
    t: number;
    d: {
      fid: string;
      name: string;
      fmax: string;
      fmin: string;
      amount_list: string;
      show_name: string;
      amount_array: {
        amount: string;
        discount: string;
      }[];
      pay_rate: number;
      ty: number;
    }[];
    r: number;
    c: string;
  }>({ url: "/pay/channel", method: "get", params });

// 发起充值
export const ApiDoDeposit = (data: {
  fid: string;
  amount: string;
  flag: string; // 1参与优惠2不参与优惠
}) => request<string>({ url: "/pay/deposit", method: "post", data });

// 提交提现
export const ApiPostWithdraw = (data: {
  fid: string;
  amount: string;
  bank_id: string;
}) => request<string>({ url: "/pay/withdraw", method: "post", data });

// 获取提现配置
export const ApiGetWithdrawConf = () =>
  request<any>({ url: "/pay/withdraw/config", method: "get" });

// 订单记录
export const ApiGetMemberRecord = (params: {
  flag: string;
  page: number;
  page_size: number;
}) =>
  request<{
    t: number;
    d: Array<{
      amount: string;
      bill_no: string;
      created_at: string;
      discount: string;
      flag: number;
      fname: string;
      id: string;
      state: number;
    }>;
  }>({ url: "/member/record", method: "get", params });

// 退出登录
export const ApiLogout = () =>
  request<{}>({ url: "/member/logout", method: "get" });

// 更新头像
export const ApiUpdateAvatar = (params: { avatar: number }) =>
  request<{}>({ url: "/member/update/avatar", method: "get", params });

// 忘记密码
export const ApiResetPwd = (data: {
  sid: string;
  ts: string;
  phone: string;
  code: string;
  password: string;
}) => request<string>({ url: "/member/password/forget", method: "post", data });

// 存款优惠配置
export const ApiDepositBonusConf = (params: {
  ty?: 1 | 2; // 1 首存 2 次存
}) =>
  request<
    {
      id: number;
      name: string;
      bonus: number;
      flow: number;
      max_amount: number;
      min_amount: number;
      ty: number;
    }[]
  >({ url: "/member/promo/deposit/config", method: "get", params });

// 用户账户金额信息
export const ApiBalanceDetailInfo = () =>
  request<{
    agencyAmount: number;
    agencyLockAmount: number;
    agency_balance: number;
    brl: number;
    brl_amount: number;
    depositLockAmount: number;
    deposit_amount: number;
    deposit_balance: number;
    lockAmount: number;
    uid: string;
  }>({ url: "/member/balance", method: "get" });

// 投注记录
export const ApiGetBetRecord = (params: {
  gt: string;
  ty: string;
  flag?: string;
  page: number;
  page_size: number;
}) =>
  request<{
    t: number;
    d:
    | {
      id: string;
      game_name: string;
      bet_time: number;
      bet_amount: string;
      net_amount: string;
    }[]
    | null;
    s: number;
  }>({ url: "/member/game/record", params });

// 奖励记录
export const ApiGetBonusRecord = (params: {
  ty: string; // 6存款优惠 305邀请奖励 307宝箱奖励
  flag: string; // 1 今天 7 七天 60 六十天
  page: number;
  page_size: number;
}) =>
  request<{
    t: number;
    d:
    | {
      id: string;
      created_at: number;
      ty: string;
      amount: string;
      remark: string;
      bet_amount: string;
      net_amount: string;
    }[]
    | null;
    s: number;
  }>({ url: "/member/bonus/record", params });

// 邀请记录
export const ApiGetInviteRecord = (data: any) =>
  request<{
    t: number;
    d:
    | {
      id: string;
      uid: string;
      username: string;
      lvl: number;
      child_uid: string;
      child_username: string;
      first_deposit_at: number;
      deposit_amount: number;
      bonus_amount: number;
      created_at: number;
    }[]
    | null;
  }>({ url: "/member/invite/record", method: "post", data });

// 邀请明细总计
type LvlData = {
  id: string;
  mem_count: number;
  deposit_mem_count: number;
  first_deposit_bonus: number;
  valid_bet_amount: number;
  rebate_amount: number;
  total_amount: number;
  ty: number;
  report_time: number;
  lvl: string;
  uid: string;
  username: string;
};
export const ApiGetInviteReportTotal = () =>
  request<{
    total_amount: number;
    settled_amount: number;
    pending_amount: number;
    lvl_one: LvlData;
    lvl_two: LvlData;
    lvl_three: LvlData;
  }>({ url: "/member/report/detail", method: "post" });

// 邀请明细
export const ApiGetInviteReport = (data: {
  lvl: string;
  start_time: string;
  end_time: string;
  page: number;
  page_size: number;
}) =>
  request<{
    t: number;
    d:
    | {
      mem_count: number;
      deposit_mem_count: number;
      first_deposit_bonus: number;
      valid_bet_amount: number;
      rebate_amount: number;
      total_amount: number;
      report_time: string;
    }[]
    | null;
  }>({ url: "/member/report/list", method: "post", data });

// facebook telegram客服链接
export const ApiGetFBTG = () =>
  request<{
    telegram: string;
    facebook: string;
    onlinecs: string;
  }>({
    url: "/member/cs/list",
    params: { fields: "telegram,facebook,onlinecs" },
  });

// 获取app下载地址
export const getAppDownloadUrl = (dv: number) =>
  request<{
    platform: string;
    version: string;
    is_force: number;
    content: string;
    url: string;
  }>({ url: "/member/app/upgrade", params: { dv } });

// 在线发送手机验证码
export const ApiOnlinePhoneCode = (data: {
  ty: number; // 3=修改密码 4=提现 2=修改邮箱 5=修改手机
  tel?: string;
}) => request<string>({ url: "/sms/send/online", method: "post", data });

// 在线发送邮箱验证码
export const ApiOnlineEmailCode = (data: {
  ty: number; // 3=修改密码 4=提现 2=修改邮箱 5=修改手机
  mail?: string;
}) => request<string>({ url: "/sms/send/online/mail", method: "post", data });

// 修改支付密码
export const ApiUpdatePayPwd = (data: {
  ty: number; // 1 手机号 2 邮箱的验证码
  sid: string;
  ts: string;
  code: string;
  password: string;
  old?: string;
}) =>
  request<string>({ url: "/member/pay/password/update", method: "post", data });

// 修改登录密码
export const ApiUpdateLoginPwd = (data: {
  old_password: string;
  password: string;
  confirm_password: string;
}) => request<string>({ url: "/member/password/update", method: "post", data });

// 绑定手机
export const ApiBindPhone = (data: {
  sid: string;
  ts: string;
  code: string;
  phone: string;
}) => request<any>({ url: "/member/bind/phone", method: "post", data });

// 绑定邮箱
export const ApiBindEmail = (data: {
  sid: string;
  ts: string;
  code: string;
  email: string;
}) => request<any>({ url: "/member/bind/email", method: "post", data });

// 银行卡列表
export const ApiBankList = () =>
  request<{
    d: Array<{
      created_at: number;
      flag: number;
      id: string;
      pix_account: string;
      pix_id: string;
      real_name: string;
      state: number;
      uid: string;
      username: string;
    }>;
    t: number;
  }>({ url: "/member/bankcard/list", method: "get" });

// 银行卡类型列表
export const ApiBankTypes = () =>
  request<{
    d: Array<{
      bankcode: string;
      bankname: string;
      id: string | number;
      state: string | number;
    }>;
    t: number;
  }>({ url: "/member/banktype/list", method: "get" });

// 绑定银行卡
export const ApiBindBank = (data: {
  pix_id: string;
  flag: string;
  pix_account: string;
  realname: string;
  sid: string;
  ts: string;
  code: string;
  ty: number; // 1手机 2邮箱
}) => request<any>({ url: "/member/bankcard/insert", method: "post", data });

// 更新个人信息
export const ApiUpdateUserInfo = (data: {
  phone: string;
  email: string;
  telegram: string;
}) => request<any>({ url: "/member/update/info", method: "post", data });

// 提现手续费
export const ApiWithdrawFee = (params: { amount: number | string }) =>
  request({ url: "/pay/withdraw/rate", method: "get", params });

// 金额转换
export const ApiWalletTransfer = (data: { amount: number | string }) =>
  request({ url: "member/wallet/transfer", method: "post", data });
