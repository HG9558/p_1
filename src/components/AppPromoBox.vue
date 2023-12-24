<template>
  <div class="app-promos-box">
    <ul class="inner">
      <li
        v-for="(p, idx) in promos"
        :key="p.path"
        class="item"
        :class="'item-' + idx"
        @click="() => itemClick(p)"
      >
        <h3>{{ p.title }}</h3>
        <AppImage
          :src="'/img/' + p.icon"
          @load="($event) => imgLoaded($event)"
        />
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup name="AppPromoBox">
const router = useRouter();

const promos = [
  {
    path: "/promotion-detail/invite",
    icon: "facai.png",
    title: "Bónus de Convite",
  },
  // {
  //   path: "/promotion-detail/reward-box",
  //   icon: "jakpot-gold.png",
  //   title: "baú de tesouro",
  // },
];

const imgLoaded = (e: any) => {
  e.currentTarget.style.width = `var(--app-px-${Math.ceil(
    e.target.naturalWidth / 3
  )})`;
};

const itemClick = (p: any) => {
  if (p.path) {
    router.push(p.path);
  }
};
</script>
<style lang="scss" scoped>
.app-promos-box {
  overflow: visible;
  margin-bottom: 24px;
  .inner {
    display: flex;

    // display: grid;
    // grid-template-rows: auto;
    // grid-column-gap: 16px;
    // grid-auto-flow: column;
    // grid-template-columns: 1fr 1fr;
    // align-items: start;
    // justify-items: start;
    // overflow: visible;

    &::-webkit-scrollbar {
      display: none;
    }
    .item {
      position: relative;
      overflow: visible;
      height: 99px;
      border-radius: 10px;
      background: linear-gradient(314deg, #ffda00 0%, #297e46 100%);
      padding: 13px 146px 0 18px;
      width: 100%;
      h3 {
        margin: 0;
        padding: 0;
        color: #fff;
        font-size: 24px;
        font-weight: 500;
        line-height: 34px;
        white-space: nowrap;
        transform: translateY(54%);
      }
      img {
        position: absolute;
        width: 0;
        right: 0;
        bottom: 0;
      }
      &.item-0 {
        img {
          right: 4px;
          bottom: -7px;
        }
      }
      &.item-1 {
        background: linear-gradient(314deg, #ffdf2d 0%, #b40000 100%);
        h3 {
          word-break: normal;
        }
        img {
          right: -4px;
          bottom: 0;
        }
      }
    }
  }
}
</style>
