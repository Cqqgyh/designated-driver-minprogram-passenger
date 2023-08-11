<template>
  <tm-app>
    <view>home</view>
    <tm-button :margin="[10]" :shadow="0" size="large" label="按钮"></tm-button>
    <tabbar-nav></tabbar-nav>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useQqMapSdk } from '@/hooks/useQqMapSdk'
const {qqmapsdk} = useQqMapSdk()
//#region <map相关>
// 中心经度
const longitude = ref<number>()
// 中心纬度
const latitude = ref<number>()
//#endregion


</script>

<style scoped>
.de {
//color: rgba(1, 99, 255, 1);
//color: rgba(117, 117, 117, 1);
  color: rgba(254, 166, 0, 1);
}
</style>
