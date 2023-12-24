<template>
    <div class='p-record-transaction'>
        <app-header title="Histórico de bônus"  leftArrow></app-header>
        <div class="fixedbox">
            <div class="selectbox">
                Pesquisar
                <AppSelect v-model="formQuery.query1" :list-data="tabList" />
                <AppSelect v-model="formQuery.query2" :list-data="tabList" />
            </div>
            <div class="marginbox30"></div>
        </div>
        <div class="tablebox">
            <app-table :local="216" :data="list" :cols="cols" :form-data="formQuery"></app-table>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { ref, reactive } from 'vue';
// import useQueryPage from "~/composables/useList";
const list = ref<any>([]);
const cols = ref([
    {
        title: 'Nome do</br> evento',
        key: 'type'
    },
    {
        title: 'Tempo',
        key: 'time'
    },
    {
        title: 'Valor <br />da aposta',
        key: 'aposta'
    },
    {
        title: 'Lucro',
        key: 'lucro'
    }
])
const loading = ref(false);
const finished = ref(false);
const formQuery = reactive({
    query1: '1',
    query2: '2'
})
// const {} = useQueryPage(formQuery)
const refresh = () => {
    console.log("===refresh===")
}
const changeTab = () => {
    console.log(active);
}

const active = ref('1')
const tabList = [
    {
        label: 'Todas',
        value: '1'
    }, {
        label: 'ganho',
        value: '2'
    }
]
const getList = () => {
    loading.value = true;
    setTimeout(() => {
        for (let i = 0; i <= 30; i++) {
            list.value.push({
                type: 'Fortune Tiger',
                time: '2023-06-26 11:05:53',
                aposta: '25.00',
                lucro: '-25.00'
            })
        }

    }, 1000);
}
getList()
const loadMoreData = () => {
    getList();
}
</script>
<style lang='scss' scoped>
.flex-sb {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.p-record-transaction {
    background: rgba(0, 10, 29, 1);
    min-height: 100vh;

    .fixedbox{
        background: rgba(0, 10, 29, 1);
        position: fixed;
        z-index: 11;
        width: 100%;
        top: 110px;
        .marginbox30{
            height: 30px;
            background: rgba(217, 217, 217, 0.1);
        }
    }

    .selectbox {
        padding: 8px 24px;
        display: flex;
        align-items: center;
        gap: 0 14px;
        box-sizing: border-box;
        box-shadow: 0px -1px 0px 0px rgba(255, 255, 255, 0.1) inset;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
        font-size: 24px;
        background: rgba(1, 26, 81, 0.3);
    }

    .tablebox {
        padding: 215px 16px 79px 16px;
        background: rgba(217, 217, 217, 0.1);
        border-radius: 20px;
    }
}
</style>

<route lang="yaml">
  meta:
    auth: true
</route>
