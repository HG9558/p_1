
export const useDragStore = defineStore('drag', () => {
    const showChatDrag = ref(true) // 聊天室开关

    const setShowChatDrag = (val: boolean) => {
        showChatDrag.value = val
    }

    return {
        showChatDrag,
        setShowChatDrag,
    }
});
