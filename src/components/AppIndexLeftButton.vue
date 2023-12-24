<script setup lang="ts" name="app-index-left-button">
</script>

<template>
  <button class="app-index-left-button">
    <div class="left">
      <slot></slot>
    </div>
    <div class="right">
      <slot name="sub"></slot>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.app-index-left-button {
  border: none;
  background: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 72px;
  border-radius: 8px;
  color: #FFF;
  font-size: 28px;
  font-weight: 700;
  line-height: normal;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.10);
  color: #fff;
  text-align: left;
  padding: 0 32px;

  &.style1 {
    background: linear-gradient(180deg, #09BD94 0%, #2D4EE9 100%);
  }

  &.style2 {
    background: linear-gradient(180deg, #FF9739 0%, #F23D32 100%), #2A2E3E;
  }

  &.style3 {
    background: linear-gradient(180deg, #A14FD1 0%, #EF30A5 100%), #2A2E3E;
  }

  &.style4 {
    background: linear-gradient(180deg, #9C27D7 0%, #2459FE 100%), #2A2E3E;
  }
}
</style>
