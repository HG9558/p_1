export enum GameNavEnum {
  Ao_Vivo = 1,
  Pesca = 2,
  Slot = 3,
  Esporte = 4,
  Pôquer = 5,
  Esports = 6,
  Quente = 100,
  Dentro_De_Casa = 101,
}

export type GameItem = {
  game_type: number
  id: string
  maintained: number
  name: string
  seq: number
  state: number
  [k: string]: any
}
