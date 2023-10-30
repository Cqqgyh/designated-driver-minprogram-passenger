<template>
  <tm-app v-if="orderDetail.driverInfoVo">
    <!--    司机信息-->
    <tm-sheet>
      <view class="flex flex-row flex-row-center-start">
        <tm-avatar :size="170" :round="26" :img="orderDetail.driverInfoVo.avatarUrl"></tm-avatar>
        <view class="flex flex-col ml-25">
          <view class="text-size-lg text-weight-b">{{ orderDetail.driverInfoVo.name }}</view>
          <view class="text-size-g text-gray">驾龄{{ orderDetail.driverInfoVo.driverLicenseAge }}年</view>
        </view>
      </view>
      <tm-divider></tm-divider>
      <view>
        <tm-cell :margin="[0, 0]" :titleFontSize="30">
          <template #title>
            <view class="flex flex-row flex-row-center-start">
              <view style="height: 20rpx; width: 20rpx; background-color: #93da5f; border-radius: 50%"></view>
              <text style="width: 400rpx" class="ml-20" _class="text-overflow-1">{{ orderDetail.startLocation }}</text>
            </view>
          </template>
          <template #right>
            <text class="ml-10 text-gray-1">{{ '出发地' }}</text>
          </template>
        </tm-cell>
        <tm-cell :margin="[0, 0]" :titleFontSize="30">
          <template #title>
            <view class="flex flex-row flex-row-center-start">
              <view style="height: 20rpx; width: 20rpx; background-color: #48b6fc; border-radius: 50%"></view>
              <text style="width: 400rpx" class="ml-20" _class="text-overflow-1">{{ orderDetail.endLocation }}</text>
            </view>
          </template>
          <template #right>
            <text class="ml-10 text-gray-1">{{ '目的地' }}</text>
          </template>
        </tm-cell>
      </view>
      <!--      订单创建时间-->
      <tm-cell :margin="[0, 0]" :titleFontSize="30">
        <template #title>
          <tm-text color="grey" :label="orderDetail.createTime"></tm-text>
        </template>
        <template #right></template>
      </tm-cell>
    </tm-sheet>
    <!--    司机信息-->
    <tm-sheet>
      <view v-for="item in descriptionsList.slice(0, descriptionsList.length - 1)" :key="item.label" class="flex flex-row" style="height: 80rpx">
        <view class="flex-1 flex flex-col-center-center border-l-2 border-t-2">{{ item.label }}</view>
        <view class="flex-1 flex-col-center-center border-l-2 border-r-2 border-t-2 text-gray-1">{{ item.value }}元</view>
      </view>
      <view v-for="item in descriptionsList.slice(descriptionsList.length - 1)" :key="item.label" class="flex flex-row" style="height: 80rpx">
        <view class="flex-1 flex flex-col-center-center border-l-2 border-t-2 border-b-2">{{ item.label }}</view>
        <view class="flex-1 flex-col-center-center border-l-2 border-r-2 border-t-2 border-b-2">{{ item.value }}元</view>
      </view>
    </tm-sheet>
    <!--    <view class="flex flex-row flex-row-bottom-end pay-container mb-10">-->
    <!--   -->
    <!--    </view>-->
    <tm-sheet v-if="orderDetail.status === OrderStatus.UNPAID && !orderDetail.orderBillVo?.couponAmount" :padding="[0, 5, 0, 0]">
      <tm-drawer>
        <template>
          <view v-for="item in couponList" :key="item.id">
            <tm-coupon
              :priceDetail="{
                price: item.couponType === 1 ? item.amount : item.discount.toFixed(0), //价格金额
                suffix: item.couponType === 1 ? '元' : '折', //后缀文本
                prefix: '', //前缀文本
                subtext: '' //小文本
              }"
              :rightDetail="{
                title: item.couponType === 1 ? item.amount + '元' : item.discount.toFixed(0) + '折', //标题
                subtitle: item.name, //副标题
                time: item.expireTime //有效期时间文本
              }"
              color="pink"
              linear="right"
              linear-deep="accent"
              mainColor="yellow"
              font-color=""
              extra
            >
              <template v-slot:thumb>
                <text></text>
              </template>
              <template v-slot:btn>
                <tm-checkbox @click="checkedCoupon(item)" color="pink" :round="24" v-model="item.isCheck"></tm-checkbox>
              </template>
              <template v-slot:extra>
                <tm-text :font-size="22" _class="opacity-7" :label="item.description"></tm-text>
              </template>
            </tm-coupon>
          </view>
        </template>
        <template v-slot:trigger>
          <tm-cell
            :round="3"
            @click="getBestCouponHandle"
            :margin="[0, 0, 0, 16]"
            :rightText="currentCoupon?.name || '待选择'"
            :titleFontSize="30"
            title="选择优惠券"
          ></tm-cell>
        </template>
      </tm-drawer>
    </tm-sheet>

    <!--    支付 fixed b-0 -->
    <view class="flex flex-row flex-row-bottom-end pay-container mb-10">
      <loading-button color="red" :click-fun="handleReturn" :margin="[10]" :fontSize="35" :shadow="0" size="middle" label="返回"></loading-button>
      <loading-button
        v-if="orderDetail.status === OrderStatus.UNPAID"
        color="red"
        :click-fun="handlePay"
        :margin="[10]"
        :fontSize="35"
        :shadow="0"
        size="middle"
        label="支付"
      ></loading-button>
    </view>
  </tm-app>
</template>
<script setup lang="ts">
import { ICoupon, IOrderDetail } from '@/api/order/types'
import { getBestCoupon, getOrderDetail } from '@/api/order'
import { usePayStore } from '@/store/modules/pay'
import { OrderStatus } from '@/config/constEnums'
const payStore = usePayStore()
const props = defineProps({
  orderId: {
    type: String,
    required: true
  }
})
const descriptionsList = ref<{ label: string; value: number | string }[]>([])
const orderDetail = ref({} as IOrderDetail)
// 获取订单详情
const getOrderDetailHandle = async (id: number | string) => {
  const res = await getOrderDetail(id)
  orderDetail.value = res.data
  descriptionsList.value = [
    { label: '里程费', value: res.data.orderBillVo?.distanceFee || 0 },
    { label: '等时费用', value: res.data.orderBillVo?.waitFee || 0 },
    { label: '路桥费', value: res.data.orderBillVo?.tollFee || 0 },
    { label: '停车费', value: res.data.orderBillVo?.parkingFee || 0 },
    { label: '其他费用', value: res.data.orderBillVo?.otherFee || 0 },
    { label: '远程费', value: res.data.orderBillVo?.longDistanceFee || 0 },
    { label: '顾客好处费', value: res.data.orderBillVo?.favourFee || 0 },
    { label: '系统奖励费', value: res.data.orderBillVo?.rewardFee || 0 },
    { label: '优惠券金额', value: -res.data.orderBillVo?.couponAmount || 0 },
    { label: '总费用', value: res.data.orderBillVo?.totalAmount || 0 },
    { label: '应付费用', value: res.data.orderBillVo?.payAmount || 0 }
  ]
}
// 返回
const handleReturn = async () => {
  await uni.navigateBack()
}
// 支付
const handlePay = () => {
  payStore.submitOrder({
    orderId: orderDetail.value.orderId,
    orderNo: orderDetail.value.orderNo,
    customerCouponId: currentCoupon.value?.customerCouponId || 0
  })
}
//#region <优惠券相关>
const couponList = ref<(ICoupon & { isCheck: boolean })[]>([])
// 当前选中的优惠券Id
const currentCoupon = ref({} as ICoupon & { isCheck: boolean })
// 请求可用优惠券列表
async function getBestCouponHandle() {
  if (couponList.value.length) return
  const res = await getBestCoupon(orderDetail.value.orderId)
  couponList.value = res.data.map((item) => ({ ...item, isCheck: false }))
}
// 选中某个优惠券
function checkedCoupon(item: ICoupon & { isCheck: boolean }) {
  currentCoupon.value = item.isCheck ? ({} as unknown as ICoupon & { isCheck: boolean }) : item
  // couponList中其他选项的isCheck设置为false
  couponList.value.forEach((item2) => {
    if (item2.customerCouponId !== item.customerCouponId) {
      item2.isCheck = false
    }
  })
}
//#endregion
onLoad(() => {
  console.log('props.orderId', props?.orderId)
  props?.orderId && getOrderDetailHandle(props?.orderId as unknown as string)
})
</script>

<style scoped>
.pay-container {
  width: 100vw;
}
</style>
