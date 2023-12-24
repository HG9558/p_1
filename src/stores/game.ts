import { GameNavEnum } from '~/types/common'

export const useGameStore = defineStore('game', () => {
  const gameItemPopupVisible = ref(false)
  const gameItemData = ref()

  // 查询游戏列表时点击场馆
  const queryGamePlat = ref<any>({
    id: '0',
    value: '0'
  })

  const gameNavData = computed<any[]>(() => {
    if (gameNavInit.value) {
      const arr = Object.keys(gameNavInit.value).map(i => +i)
      return <any[]>[
        {
          name: 'Quente',
          id: GameNavEnum.Quente,
          path: '/'
        }, {
          name: 'Dentro De Casa',
          id: GameNavEnum.Dentro_De_Casa,
          path: '/rec-fav-game'
        }].concat(<any[]>[{
          name: 'Slot',
          id: GameNavEnum.Slot
        }, {
          name: 'Pesca',
          id: GameNavEnum.Pesca
        }, {
          name: 'Pôquer',
          id: GameNavEnum.Pôquer
        }, {
          name: 'Esporte',
          id: GameNavEnum.Esporte
        }, {
          name: 'Ao Vivo',
          id: GameNavEnum.Ao_Vivo
        }, {
          name: 'Esports',
          id: GameNavEnum.Esports
        }
        ].filter(i => arr.indexOf(i.id) !== -1))
    }
    return []
  })

  const { run: runGetGameNavInit, data: gameNavInit } = useRequest(ApiGameNav)

  const setQueryGamePlat = (item: any) => {
    queryGamePlat.value = item
  }

  // 当前选中的游戏筛选标签
  const queryGameTag = ref('0')
  const setQueryGameTag = (v: string) => {
    queryGameTag.value = v
  }

  const setGameItemPopupVisible = (visible: boolean, data?: any) => {
    if (visible) {
      gameItemData.value = data
    } else {
      // gameItemData.value = undefined
    }
    gameItemPopupVisible.value = visible
  }

  const needResizeGameTypeTab = ref()
  const setNeedResizeGameTypeTab = (item: any) => {
    needResizeGameTypeTab.value = item
  }

  const saveList = reactive<number[]>([]);
  const changeSaveList = (id: number) => {
    if (saveList.includes(id)) {
      const index = saveList.findIndex(_ => _ === id);
      saveList.splice(index, 1);
    } else {
      saveList.push(id);
    }
  }

  return {
    runGetGameNavInit,
    gameNavData,
    saveList,
    changeSaveList,
    gameNavInit,
    queryGamePlat,
    queryGameTag,
    setQueryGamePlat,
    setQueryGameTag,
    gameItemPopupVisible,
    gameItemData,
    setGameItemPopupVisible,
    needResizeGameTypeTab,
    setNeedResizeGameTypeTab,
  }
})
