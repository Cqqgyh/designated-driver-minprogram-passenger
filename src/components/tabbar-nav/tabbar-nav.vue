<template>
  <tm-tabbar style="width: 100rpx !important" :autoSelect="false" v-model:active="tabBarStore.activeNavIndex" v-bind="$attrs">
    <tm-tabbar-item
      v-for="item in tabBarStore.tabBarNavList"
      :key="item.index"
      @click="tabBarStore.setActiveNavIndex(item.index)"
      :url="item.pagePath"
      :activeColor="item.activeColor"
      open-type="switchTab"
      :text="item.text"
      :icon="item.icon"
    ></tm-tabbar-item>
    <!--    <tm-tabbar-item-->
    <!--      @click="activeNavIndex = 0"-->
    <!--      url="/pages/index/index"-->
    <!--      activeColor="orange"-->
    <!--      count="HOT"-->
    <!--      open-type="switchTab"-->
    <!--      text="首页"-->
    <!--      icon="tmicon-collection-fill"-->
    <!--    ></tm-tabbar-item>-->
    <!--    <tm-tabbar-item-->
    <!--      @click="activeNavIndex = 4"-->
    <!--      activeColor="orange"-->
    <!--      :count="8"-->
    <!--      url="/pages/userCenter/userCenter"-->
    <!--      active-->
    <!--      text="图表中心"-->
    <!--      unicon="tmicon-account"-->
    <!--      open-type="switchTab"-->
    <!--      icon="tmicon-userplus-fill"-->
    <!--    ></tm-tabbar-item>-->
  </tm-tabbar>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useTabBarStore } from '@/store/modules/tabBarNav'
import {getCurrentPageInfo} from "@/utils";
const pageInfo = getCurrentPageInfo()
const tabBarStore = useTabBarStore()
onShow(() => {
  // 找到当前路由
  const routePathIndex = tabBarStore.tabBarNavList.find(item => item.pagePath === pageInfo.route)?.index
  // 设置当前活动路由
  routePathIndex && tabBarStore.setActiveNavIndex(routePathIndex)
})

</script>
