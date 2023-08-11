<template>
  <tm-app>
    <view>userCenter</view>
    <tm-button @click="demo" :margin="[10]" :shadow="0" size="large" label="按钮"></tm-button>
    <tabbar-nav></tabbar-nav>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/hooks/useTheme'
// 切换主题
function demo() {
  useTheme().toggleThemeColor('#be2edd')
  // useTheme().toggleThemeColor('red')
}
</script>

<style scoped></style>
