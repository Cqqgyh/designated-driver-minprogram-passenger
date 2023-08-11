<template>
  <template></template>
</template>
<script lang="ts" setup>
uni.hideTabBar()
</script>
<style>
/* #ifdef APP-PLUS-NVUE */
@import './tmui/scss/nvue.css';
/* #endif */
/* #ifndef APP-PLUS-NVUE */
@import './tmui/scss/noNvue.css';
/* #endif */
page {
  width: 100vw;
}
</style>
