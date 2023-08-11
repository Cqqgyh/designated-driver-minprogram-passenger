<template>
  <tm-app>
    <view>home</view>
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

<style scoped>
.de {
  //color: rgba(1, 99, 255, 1);
  //color: rgba(117, 117, 117, 1);
  color: rgba(254, 166, 0, 1);
}
</style>
