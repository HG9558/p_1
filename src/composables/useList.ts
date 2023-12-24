import { ref, watch, computed } from 'vue'
//定义options 类型
type Options = {
    params?: Record<string, any>,
    limit?: number
}

export default function useQueryPage<T>(options: Options, request: (options: Options["params"]) => Promise<Record<string, any>>) {
    //定义常用分页所需参数
    const loading = ref(false) //加载中状态
    const current = ref(0)  //当前页码
    const page = ref(0) //请求页码
    const totalPages = ref(0)  //总页数
    const limit = ref(options.limit || 10)  //每页请求数量
    const total = ref(0)   //数据总条数
    const list = ref<Array<any>>([])   //list数据
    const finished = ref(false);   //是否请求完全部数据
    const params = computed(() => {
        return {
            limit: limit.value,
            page: page,  
            ...options.params
        }
    })
    //分页查询操作
    const handleGetList = async () => {
        loading.value = true
        setTimeout(() => {
            for (let i = 0; i < 10; i++) {
                list.value.push(list.value.length + 1);
            }
            loading.value = false;

            if (list.value.length > 30) {
                // 数据全部加载完成
                finished.value = true;
            }

        }, 1000);
        //这里调用接口
        // const res = await request(params);
        // if (res.success) {
        //     total.value = res.data.total
        //     limit.value = res.data.limit
        //     current.value = res.data.current
        //     list.value = [...list.value,...res.data.data]
        //     totalPages.value = res.data.pages
        //     loading.value = false
        // }
        // if (current.value === totalPages.value ) {
        //     // 数据全部加载完成
        //     finished.value = true;
        // }
    }

    handleGetList()
    //监听page变化
    watch(page, () => {
        handleGetList()
    })
    //监听limit变化
    watch(limit, () => {
        handleGetList()
    })

    return {
        //把页面所需要的参数返回
        page, current, limit, totalPages, total, list, handleGetList, loading,finished
    }
}