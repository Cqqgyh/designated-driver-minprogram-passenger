<template>
  <view class="pay-result">
    <view class="pay-status">
      <tm-icon :font-size="150" name="tmicon-check" color="#47D368"></tm-icon>
      <text>支付成功</text>
    </view>
    <view class="btn-wrapper">
      <view class="status-btn" data-type="orderList" @click="onTapReturn(1)">查看订单</view>
      <view class="status-btn" data-type="home" @click="onTapReturn(2)">返回</view>
    </view>
  </view>
</template>
<script setup lang="ts">
const props = defineProps({
  orderNo: {
    type: String,
    default: ''
  },
  orderId: {
    type: String,
    default: ''
  }
})

const onTapReturn = (mode: number) => {
  console.log(mode)
  if (mode === 1) {
    uni.redirectTo({
      url: `/pages/orderDetail/orderDetail?orderId=${props.orderId}`
    })
  } else {
    uni.navigateBack()
  }
}
</script>

<style lang="scss" scoped>
.pay-result {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.pay-result .pay-status {
  margin-top: 100rpx;
  font-size: 48rpx;
  line-height: 72rpx;
  font-weight: bold;
  color: #333333;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pay-result .pay-status text {
  //padding-left: 12rpx;
}
.pay-result .pay-money {
  color: #666666;
  font-size: 28rpx;
  line-height: 48rpx;
  margin-top: 28rpx;
  display: flex;
  align-items: baseline;
}

.pay-result .pay-money .pay-money__price {
  font-size: 36rpx;
  line-height: 48rpx;
  color: #fa4126;
}
.pay-result .btn-wrapper {
  margin-top: 200rpx;
  padding: 12rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.pay-result .btn-wrapper .status-btn {
  height: 88rpx;
  width: 334rpx;
  border-radius: 44rpx;
  border: 2rpx solid #fa4126;
  color: #fa4126;
  font-size: 28rpx;
  font-weight: bold;
  line-height: 88rpx;
  text-align: center;
}
</style>
