import { defineStore } from 'pinia'

export const useCommonState = defineStore('homeStore', {
  state: () => {
    return {
      saveList: [] as number[],
    }
  },
  actions: {
    changeSaveList(id: number) {
      const list = this.saveList;
      if (list.includes(id)) {
        const index = list.findIndex(_ => _ === id);
        list.splice(index, 1);
      } else {
        list.push(id);
      }
      this.saveList = list;
    }
  },
})
