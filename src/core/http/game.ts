// 场馆导航
export const ApiGameNav = () => request<any>({ url: '/member/nav', method: 'get' })

// 登录游戏
export const ApiLunchGame = (params: {
  pid: string
  code: string
}) => request<any>({ url: '/game/launch', method: 'get', params })

// 游戏标签
export const ApiGameTags = (params: {
  game_type: number
  platform_id: number
}) => request<any>({ url: '/member/tag/list', method: 'get', params })

// 游戏列表
export const ApiGameList = (params: {
  game_type?: number
  page: number
  page_size: number
  platform_id: string
  tag_id: string
}) => request<any>({ url: '/member/game/list', method: 'get', params })

// 获取推荐游戏列表
export const ApiGameRecList = (params: {
  ty?: number // game_type
  l?: number // 长度
  platform_id: string
  page: number
  page_size: number,
  [key: string]: any
  // is_fav?: number
}) => request<any>({ url: '/member/game/rec/list', method: 'get', params })

// 获取热门游戏 Quente
export const ApiGameHotList = (params: {
  ty?: number // game_type
  l?: number // 长度
  platform_id: string
  page: number
  page_size: number
  is_fav?: number | undefined
  // is_fav?: number
}) => request<any>({ url: '/member/game/hot/list', method: 'get', params })

// 收藏列表
export const ApiLoveGameList = (params: {
  ty?: string
  platform_id: string // 场馆 id
  game_type?: number // game_type 大分类
  hot?: number
}) => request<{
  id: string;
  platform_id: string;
  name: string;
  en_name: string;
  br_alias: string;
  client_type: string;
  game_type: number;
  game_id: string;
  img: string;
  online: number;
  is_hot: number;
  is_fav: number;
  is_new: number;
  sorting: number;
  created_at: number;
}[] | null>({ url: '/member/fav/list', method: 'get', params })

// 推荐用户收藏的列表
export const ApiRecFavGames = (params: {
  l?: number
  ty: string
  platform_id: string
  page: number
  page_size: number
  is_fav?: number | undefined;
  // is_fav?: number
  // is_hot?: number
}) => request<any>({ url: '/member/game/fav/list', method: 'get', params })

// 关键词查询游戏
export const ApiGameKeyWordSearch = (params: {
  w?: string
  ty?: number
  page: number
  page_size: number
  platform_id: string
  tag_id: string
}) => request<any>({ url: '/member/game/search', method: 'get', params })

// 收藏一个游戏
export const ApiInsertLoveGame = (params: {
  id: string
  ty: 'rec' | 'hot' | 'fav' | ''
}) => request<any>({ url: '/member/fav/insert', method: 'get', params })

// 取消收藏
export const ApiDeleteLoveGame = (params: {
  id: string
}) => request<any>({ url: '/member/fav/delete', method: 'get', params })
