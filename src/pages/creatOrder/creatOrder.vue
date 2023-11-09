<template>
  <tm-app>
    <!--    出发地到目的地地图-->
    <map
      v-show="!showDriversPickUpPassengersRoutePlan"
      :key="1"
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
    <!--    司机到乘客路线地图-->
    <map
      v-show="showDriversPickUpPassengersRoutePlan"
      :key="2"
      id="driveMap"
      class="map"
      :longitude="takeCarInfo.carInfo.from.longitude"
      :latitude="takeCarInfo.carInfo.from.latitude"
      :polyline="takeCarInfo.carInfo.RouteInfo.polyline"
      :markers="takeCarInfo.carInfo.RouteInfo.markers"
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
    <view v-if="!isHaveReceiveOrders" class="location-panel">
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
          <view class="price">{{ takeCarInfo?.RouteInfo.totalAmount }}元</view>
        </view>
        <loading-button :block="true" :click-fun="callTaxiHandle" :margin="[10]" :shadow="0" size="large" label="呼叫代驾"></loading-button>
      </tm-sheet>
    </view>
    <view v-if="isHaveReceiveOrders" class="location-panel">
      <tm-sheet :round="3" :shadow="2">
        <view class="flex flex-row flex-row-center-start relative pl-10">
          <tm-avatar :size="150" :round="26" :img="takeCarInfo.carInfo.driverInfo.avatarUrl"></tm-avatar>
          <view class="flex flex-col ml-25">
            <view class="text-size-lg text-weight-b">{{ takeCarInfo.carInfo.driverInfo.name }}</view>
            <view class="text-size-g text-gray">驾龄{{ takeCarInfo.carInfo.driverInfo.driverLicenseAge }}年</view>
          </view>
          <view class="absolute r-20" @click="callDriverPhoneHandle">
            <uni-icons custom-prefix="iconfont" type="iconfontdianhua" size="30"></uni-icons>
          </view>
        </view>
        <!--       距离时间 -->
        <view v-if="takeCarInfo?.orderInfo.orderStatus < OrderStatus.START_SERVICE">
          <tm-cell :margin="[0, 0]" :titleFontSize="30">
            <template #title>
              <view class="flex flex-row flex-row-center-start">
                <view style="height: 20rpx; width: 20rpx; background-color: #93da5f; border-radius: 50%"></view>
                <text class="ml-20 text-overflow-3" style="width: 300rpx">距离：{{ takeCarInfo.carInfo.RouteInfo.distance }}公里</text>
                <text class="ml-20 text-overflow-3" style="width: 300rpx">时间：{{ takeCarInfo.carInfo.RouteInfo.duration }}分钟</text>
              </view>
            </template>
            <template #right>
              <view></view>
            </template>
          </tm-cell>
        </view>
        <view v-else>
          <tm-cell :margin="[0, 0]" :titleFontSize="30">
            <template #title>
              <view class="flex flex-row flex-row-center-start">
                <view style="height: 20rpx; width: 20rpx; background-color: #93da5f; border-radius: 50%"></view>
                <text class="ml-20 text-overflow-3" style="width: 300rpx">距离：{{ takeCarInfo.RouteInfo.distance }}公里</text>
                <text class="ml-20 text-overflow-3" style="width: 300rpx">时间：{{ takeCarInfo.RouteInfo.duration }}分钟</text>
              </view>
            </template>
            <template #right>
              <view></view>
            </template>
          </tm-cell>
        </view>
        <loading-button
          :block="true"
          disabled
          :click-fun="cancelOrderHandle"
          :margin="[10]"
          :shadow="0"
          size="large"
          label="取消订单"
        ></loading-button>
      </tm-sheet>
    </view>
    <tm-drawer :width="300" :height="700" :hideHeader="true" :overlayClick="false" ref="popRef" placement="bottom">
      <view class="pop-content">
        <view class="text-weight-b text-size-g">请耐心等待司机接单</view>
        <view class="text-grey text-weight-b text-size-n my-5">15分钟内暂无司机接单将自动取消订单</view>
        <view class="my-10 text-size-g">
          {{
            `${timeIncrease.timeDateTypeInfo.value.hours}:${timeIncrease.timeDateTypeInfo.value.minutes}:${timeIncrease.timeDateTypeInfo.value.seconds}`
          }}
        </view>
        <loading-button :width="500" :click-fun="cancelGetOrderHandle" :margin="[10]" :shadow="0" size="large" label="取消接单"></loading-button>
      </view>
    </tm-drawer>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTakeCarInfoStore } from '@/store/modules/takeCarInfo'
import tmDrawer from '@/tmui/components/tm-drawer/tm-drawer.vue'
import { useTimeIncrease } from '@/hooks/useTimeIncrease'
import { customerCancelNoAcceptOrder, getOrderDetail } from '@/api/order'
import { OrderStatus } from '@/config/constEnums'

const map = uni.createMapContext('map')
const driveMap = uni.createMapContext('driveMap')
// 打车相关信息仓库
const takeCarInfo = useTakeCarInfoStore()
// const takeCarInfo = routeInfoObj
// 展示司机接乘客路线，呼叫订单中
const showDriversPickUpPassengersRoutePlan = ref(false)
// 已经有司机接单
const isHaveReceiveOrders = ref(false)

// 回到当前位置
function moveCurrentHandle() {
  map.moveToLocation(takeCarInfo.from)
  driveMap.moveToLocation(takeCarInfo.carInfo.from)
}

//#region <等待订单>
// 存放轮询定时器
const timer = ref<NodeJS.Timeout | null>(null)
// 时间增长
const timeIncrease = useTimeIncrease({
  duration: 15 * 60 * 1000,
  callback: () => {
    console.log('时间到了')
    // 取消订单
    cancelGetOrderHandle()
  },
  startSeconds: 0
})
// 呼叫代驾
async function callTaxiHandle() {
  console.log('呼叫代驾callTaxiHandle')
  // showDriversPickUpPassengersRoutePlan.value = false
  openPopupHandle()
  timeIncrease.start()
  //   提交订单
  await takeCarInfo.submitOrderHandle()
  //   开启轮询查询订单状态
  await queryOrderStatusHandle()
}
// 订单轮询所需参数
const queryOrderStatusParams = {
  WAITING_ACCEPT: () => {
    console.log('等待接单')
  },
  // 接单成功
  ACCEPTED: async () => {
    showDriversPickUpPassengersRoutePlan.value = true
    isHaveReceiveOrders.value = true
    closePopupHandle()
    //   请求司机信息
    await takeCarInfo.getDriverInfoHandle()
    //   司机实时位置
    await takeCarInfo.queryCarLocationToStartPosition(() => {
      console.log('getCarLocationHandle:', takeCarInfo.carInfo.RouteInfo.markers)
    })
    //   更新地图位置
  },
  // 司机到达代驾位置
  DRIVER_ARRIVED: async () => {
    // 停止司机位置轮询：司机位置->出发地
    takeCarInfo.stopQueryCarLocationToStartPosition()
    console.log('司机已到达')
  },
  // 更新车辆信息
  UPDATE_CART_INFO: () => {
    console.log('更新车辆信息')
  },
  // 开始服务
  START_SERVICE: () => {
    // 停止轮询订单状态
    // takeCarInfo.stopQueryOrderStatus()
    showDriversPickUpPassengersRoutePlan.value = false
    // 开启新的轮询：出发地->目的地
    takeCarInfo.queryCarLocationToEndPosition(() => {
      console.log('queryCarLocationToEndPosition:', takeCarInfo.RouteInfo.markers)
    })
    console.log('开始服务')
  },
  // 结束服务
  END_SERVICE: () => {
    // 停止轮询司机位置
    takeCarInfo.stopQueryCarLocationToEndPosition()
    console.log('结束服务')
  },
  //  代付款
  UNPAID: () => {
    // 结束账单状态轮询
    takeCarInfo.stopQueryOrderStatus()
    // 跳转到订单详情页面
    uni.redirectTo({
      url: `/pages/orderDetail/orderDetail?orderId=${takeCarInfo.orderInfo.orderId}`
    })
    // 清空订单信息
    takeCarInfo.$reset()
    console.log('takeCarInfo', takeCarInfo)
    console.log('代付款')
  },
  // 已付款
  PAID: () => {
    console.log('已付款')
  },
  // 取消订单
  CANCEL_ORDER: () => {
    console.log('取消订单')
  }
}
// 订单状态轮询
async function queryOrderStatusHandle() {
  await takeCarInfo.queryOrderStatus({ ...queryOrderStatusParams })
}
// 取消订单
function cancelGetOrderHandle() {
  console.log('取消订单cancelOrderHandle')
  closePopupHandle()
  timeIncrease.stopAndReset()
  // 显示出发地到目的地地图
  showDriversPickUpPassengersRoutePlan.value = false
  //   停止轮询订单状态
  takeCarInfo.stopQueryOrderStatus()
  //   取消接单
  customerCancelNoAcceptOrder(takeCarInfo.orderInfo.orderId)
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

//#region <司机订单后逻辑>
// 取消订单
function cancelOrderHandle() {
  isHaveReceiveOrders.value = false
  // 停止查询司机位置
  takeCarInfo.stopQueryCarLocationToStartPosition()
  console.log('取消订单cancelOrderHandle')
}
// 打电话
function callDriverPhoneHandle() {
  uni.makePhoneCall({
    phoneNumber: '114' //仅为示例
  })
  console.log('打电话callDriverPhoneHandle')
}
//#endregion
// 根据订单id获取订单信息
async function getOrderInfoHandleByOrderId(orderId: number | string) {
  const res = await getOrderDetail(orderId)
  //   更新司机信息
  res.data.driverInfoVo && takeCarInfo.setCarDriverInfo(res.data.driverInfoVo)
  //   更新订单信息
  res.data.orderId && takeCarInfo.setOrderId(res.data.orderId)
  //   更新出发地信息
  takeCarInfo.setFrom({
    address: res.data.startLocation,
    longitude: res.data.startPointLongitude,
    latitude: res.data.startPointLatitude
  })
  //   更新目的地信息
  takeCarInfo.setTo({
    address: res.data.endLocation,
    longitude: res.data.endPointLongitude,
    latitude: res.data.endPointLatitude
  })
  takeCarInfo.setOrderStatus(res.data.status)
  // 如果状态为小于开始服务的状态，其实就是等待接单中的订单
  if (res.data.status < OrderStatus.ACCEPTED) {
    showDriversPickUpPassengersRoutePlan.value = false
    isHaveReceiveOrders.value = false
    openPopupHandle()
    timeIncrease.stopAndReset()
    timeIncrease.setStartTime(Math.floor((new Date().getTime() - new Date(res.data.createTime).getTime()) / 1000))
    timeIncrease.start()
  }
  // 如果状态为小于开始服务的状态
  else if (res.data.status < OrderStatus.START_SERVICE) {
    showDriversPickUpPassengersRoutePlan.value = true
    isHaveReceiveOrders.value = true
    closePopupHandle()
    //   请求司机信息
    await takeCarInfo.getDriverInfoHandle()
    //   司机实时位置
    await takeCarInfo.queryCarLocationToStartPosition(() => {
      console.log('getCarLocationHandle:', takeCarInfo.carInfo.RouteInfo.markers)
    })
  } else {
    showDriversPickUpPassengersRoutePlan.value = false
    isHaveReceiveOrders.value = true
  }
  console.log('showDriversPickUpPassengersRoutePlan', showDriversPickUpPassengersRoutePlan)
  console.log('isHaveReceiveOrders', isHaveReceiveOrders)
  await queryOrderStatusHandle()
}
// 根据订单id 重载页面
async function reloadPageHandleByOrderId(orderId: number | string) {
  //   显示地图
  // showDriversPickUpPassengersRoutePlan.value = false
  //  停止轮询
  takeCarInfo.stopQueryOrderStatus()
  takeCarInfo.stopQueryCarLocationToEndPosition()
  takeCarInfo.stopQueryCarLocationToStartPosition()
  // //   清空订单信息
  takeCarInfo.$reset()
  //   重新获取订单信息
  await getOrderInfoHandleByOrderId(orderId)
}

onLoad(async (options: any) => {
  console.log('options', options)
  if (options?.orderId) {
    await reloadPageHandleByOrderId(options?.orderId)
  }
  await takeCarInfo.routePlan() //   获取当前位置信息
})
onUnload(() => {
  timeIncrease.stopAndReset()
  //   停止轮询订单状态
  takeCarInfo.stopQueryOrderStatus()
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
