<template>
  <tm-app>
    <!--    <cover-view class="location">-->
    <!--    </cover-view>-->

    <view>userCenter</view>
    <tm-button @click="demo" :margin="[10]" :shadow="0" size="large" label="按钮1"></tm-button>
    <tm-icon :font-size="50" color="red" name="tmicon-playcircle-fill"></tm-icon>
    <theme-icon custom-prefix="iconfont" type="iconfontzan" size="50"></theme-icon>
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
