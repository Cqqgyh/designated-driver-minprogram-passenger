<template>
  <tm-app>
    <map
      v-show="!showDriversPickUpPassengersRoutePlan"
      id="map"
      class="map"
      :longitude="takeCarInfo.from.longitude"
      :latitude="takeCarInfo.from.latitude"
      :polyline="takeCarInfo.RouteInfo.polyline"
      :markers="takeCarInfo.RouteInfo.markers"
      scale="12"
      :enable-traffic="false"
      :show-location="true"
      :enable-poi="true"
      :enable-3D="true"
    >
      <cover-view @click="moveCurrentHandle()" class="location">
        <theme-icon custom-prefix="iconfont" type="iconfontditudingwei" size="30"></theme-icon>
      </cover-view>
    </map>
    <map
      v-show="showDriversPickUpPassengersRoutePlan"
      id="driveMap"
      class="map"
      :longitude="driversPickUpPassengersRoutePlan.from.longitude"
      :latitude="driversPickUpPassengersRoutePlan.from.latitude"
      :polyline="driversPickUpPassengersRoutePlan.RouteInfo.polyline"
      :markers="driversPickUpPassengersRoutePlan.RouteInfo.markers"
      scale="12"
      :enable-traffic="false"
      :show-location="true"
      :enable-poi="true"
      :enable-3D="true"
    >
      <cover-view @click="moveCurrentHandle()" class="location">
        <theme-icon custom-prefix="iconfont" type="iconfontditudingwei" size="30"></theme-icon>
      </cover-view>
    </map>
    <view class="location-panel">
      <tm-sheet :round="3" :shadow="2">
        <view class="route-info">
          <view class="label">预估距离:</view>
          <view class="price">{{ takeCarInfo?.RouteInfo.distance }}公里</view>
        </view>
        <view class="route-info">
          <view class="label">预估时间:</view>
          <view class="price">{{ takeCarInfo?.RouteInfo.duration }}分钟</view>
        </view>
        <view class="route-info">
          <view class="label">预估价格:</view>
          <view class="price">{{ takeCarInfo?.RouteInfo.cost }}元</view>
        </view>
        <loading-button :block="true" :click-fun="callTaxiHandle" :margin="[10]" :shadow="0" size="large" label="呼叫代驾"></loading-button>
      </tm-sheet>
    </view>
    <tm-drawer :width="300" :height="700" :hideHeader="true" :overlayClick="false" ref="popRef" placement="bottom">
      <view class="pop-content">
        <view class="text-weight-b text-size-g">请耐心等待司机接单</view>
        <view class="text-grey text-weight-b text-size-n my-5">5分钟内暂无司机接单将自动取消订单</view>
        <view>
          {{
            `${timeIncrease.timeDateTypeInfo.value.hours}:${timeIncrease.timeDateTypeInfo.value.minutes}:${timeIncrease.timeDateTypeInfo.value.seconds}`
          }}
        </view>
        <loading-button :block="true" :click-fun="cancelOrderHandle" :margin="[10]" :shadow="0" size="large" label="取消订单"></loading-button>
      </view>
    </tm-drawer>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTakeCarInfoStore } from '@/store/modules/takeCarInfo'
import tmDrawer from '@/tmui/components/tm-drawer/tm-drawer.vue'
import { useTimeIncrease } from '@/hooks/useTimeIncrease'

const map = uni.createMapContext('map')
const driveMap = uni.createMapContext('driveMap')
// 打车相关信息仓库
// const takeCarInfo = useTakeCarInfoStore()
const showDriversPickUpPassengersRoutePlan = ref(false)
const takeCarInfo = uni.getStorageSync('routeInfo')
const driversPickUpPassengersRoutePlan = uni.getStorageSync('driversPickUpPassengersRoutePlan')

// 回到当前位置
function moveCurrentHandle() {
  map.moveToLocation(takeCarInfo.from)
  driveMap.moveToLocation(driversPickUpPassengersRoutePlan.from)
}

//#region <等待订单>
// 时间增长
const timeIncrease = useTimeIncrease()
// 呼叫代驾
function callTaxiHandle() {
  console.log('呼叫代驾callTaxiHandle')
  showDriversPickUpPassengersRoutePlan.value = true
  openPopupHandle()
  timeIncrease.start()
}
// 取消订单
function cancelOrderHandle() {
  console.log('取消订单cancelOrderHandle')
  closePopupHandle()
  timeIncrease.reset()
}
//#endregion

//#region <弹出层>
// 打开弹出层
const popRef = ref<InstanceType<typeof tmDrawer>>()
function openPopupHandle() {
  popRef.value?.open()
  console.log('打开弹出层openPopupHandle')
}
// 关闭弹出层
function closePopupHandle() {
  popRef.value?.close()
  console.log('关闭弹出层closePopupHandle')
}
//#endregion

onLoad(() => {
  //   获取当前位置信息
  // takeCarInfo.routePlan()
})
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100vh;
}
.location {
  position: absolute;
  right: 45rpx;
  bottom: 450rpx;
  width: 60rpx;
  height: 60rpx;
}
.location-panel {
  position: absolute;
  //background: pink;
  width: 100%;
  bottom: 100rpx;
  .route-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24rpx;
    .label {
      font-size: 28rpx;
      color: #999;
    }
    .price {
      font-size: 32rpx;
      color: #333;
    }
  }
}
.pop-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30rpx 20rpx 10rpx;
  height: 500rpx;
}
</style>
