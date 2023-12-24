// 主题
type Themes = 'red' | 'blue' | 'yellow'

interface ListData {
  label: string;
  value: string;
}

type QueryGameListParams = {
  name?: string
  en_name?: string
  game_type?: number
}

type GameNavObj = {
  1: {
    "id": 1,
    "name": "真人",
    "en_name": "Ao Vivo"
  },
  2: {
    "id": 2,
    "name": "捕鱼",
    "en_name": "Pesca"
  },
  3: {
    "id": 3,
    "name": "电子",
    "en_name": "Slot"
  },
  4: {
    "id": 4,
    "name": "体育",
    "en_name": "Esporte"
  },
  5: {
    "id": 5,
    "name": "棋牌",
    "en_name": "Pôquer"
  },
  6: {
    "id": 6,
    "name": "电竞",
    "en_name": "Esports"
  }
}

// [
//   {
//     "id": 1,
//     "name": "真人",
//     "en_name": "Ao Vivo"
//   },
//   {
//     "id": 2,
//     "name": "捕鱼",
//     "en_name": "Pesca"
//   },
//   {
//     "id": 3,
//     "name": "电子",
//     "en_name": "Slot"
//   },
//   {
//     "id": 4,
//     "name": "体育",
//     "en_name": "Esporte"
//   },
//   {
//     "id": 5,
//     "name": "棋牌",
//     "en_name": "Pôquer"
//   },
//   {
//     "id": 6,
//     "name": "电竞",
//     "en_name": "Esports"
//   }
// ]

interface GameNavItem {
  id: GameNavID
  name: string
  params?: QueryGameListParams
  [k: string]: any
}
