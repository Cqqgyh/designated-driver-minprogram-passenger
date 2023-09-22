<template>
  <tm-app>
    <tm-segtab
      class="mb-15"
      :height="54"
      :width="750"
      :gutter="0"
      :color="themeColor"
      activeColor="white"
      :list="navList"
      v-model="currentIndex"
      :defaultValue="navList[0]?.id || 0"
      @change="navChangeHandle"
    ></tm-segtab>
    <tm-scrolly _style="height: 90vh" v-model="refreshStatus" v-model:bottom-value="refreshBottomStatus" @refresh="refresh" @bottom="refreshBottom">
      <view v-for="(item, index) in [...navList, ...navList, ...navList, ...navList, ...navList]" :key="index">
        <tm-sheet :margin="[25]" :round="3" :shadow="2" _class="text-size-m">
          <tm-cell :margin="[0, 0]">
            <template #title>
              <tm-text _class="text-weight-b" label="代驾订单"></tm-text>
            </template>
            <template #right>
              <text class="ml-10 text-gray-1">{{ '已完成' }}</text>
            </template>
          </tm-cell>
          <view>
            <tm-cell :margin="[0, 0]">
              <template #title>
                <view class="flex flex-row flex-row-center-start text-size-m">
                  <view style="height: 20rpx; width: 20rpx; background-color: #93da5f; border-radius: 50%"></view>
                  <text class="ml-20 text-overflow-1">
                    {{ '北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门' }}
                  </text>
                </view>
              </template>
              <template #right>
                <text class="ml-10 text-gray-1">{{ '' }}</text>
              </template>
            </tm-cell>
            <tm-cell :margin="[0, 0]">
              <template #title>
                <view class="flex flex-row flex-row-center-start">
                  <view style="height: 20rpx; width: 20rpx; background-color: #48b6fc; border-radius: 50%"></view>
                  <text class="ml-20 text-overflow-1">
                    {{ '北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门北京天安门' }}
                  </text>
                </view>
              </template>
              <template #right>
                <text class="ml-10 text-gray-1">{{ '' }}</text>
              </template>
            </tm-cell>
          </view>
          <!--      订单创建时间-->
          <tm-cell :margin="[0, 0]">
            <template #title>
              <tm-text color="grey" label="2023/08/15 16:04:00"></tm-text>
            </template>
            <template #right></template>
          </tm-cell>
        </tm-sheet>
      </view>
    </tm-scrolly>
  </tm-app>
</template>
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'

const { themeColor } = useTheme()

const currentIndex = ref(0)
const navList = ref([
  {
    id: 111,
    text: '全部'
  },
  {
    id: 1,
    text: '行程中'
  },
  {
    id: 2,
    text: '已完成'
  },
  {
    id: 3,
    text: '已取消'
  }
])
// 导航栏切换
function navChangeHandle(index: number) {
  console.log(index)
  console.log('currentIndex', currentIndex.value)
}
//#region <下拉刷新，上拉加载>
const refreshStatus = ref(false)
const refreshBottomStatus = ref(false)
// 下拉刷新
function refresh() {
  refreshStatus.value = true
  console.log('下拉刷新')
  setTimeout(() => {
    refreshStatus.value = false
  }, 1000)
}
// 上拉加载
function refreshBottom() {
  console.log('上拉加载')
}
//#endregion
</script>

<style scoped></style>
