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
      :defaultValue="0"
    ></tm-segtab>
    <tm-scrolly _style="height: 85vh" v-model="refreshStatus" v-model:bottom-value="refreshBottomStatus" @refresh="refresh" @bottom="refreshBottom">
      <!--        未使用-->
      <template v-if="currentIndex === 0">
        <view v-for="item in noUseCouponList" :key="item.couponId">
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
            @click="itemClick(item)"
            extra
          >
            <template v-slot:thumb>
              <text></text>
            </template>
            <template v-slot:extra>
              <tm-text :font-size="22" _class="opacity-7" :label="item.description"></tm-text>
            </template>
          </tm-coupon>
        </view>
      </template>
      <!--        未领取-->
      <template v-if="currentIndex === 1">
        <view v-for="item in noReceiveCouponList" :key="item.couponId">
          <tm-coupon
            :priceDetail="{
              price: item.couponType === 1 ? item.amount : item.discount * 1, //价格金额
              suffix: item.couponType === 1 ? '元' : '折', //后缀文本
              prefix: '', //前缀文本
              subtext: '' //小文本
            }"
            :rightDetail="{
              title: item.couponType === 1 ? item.amount + '元' : item.discount * 1 + '折', //标题
              subtitle: item.name, //副标题
              time: item.expireTime //有效期时间文本
            }"
            btn-label="立即领取"
            color="pink"
            linear="right"
            linear-deep="accent"
            mainColor="yellow"
            font-color=""
            @click="itemClick(item)"
            extra
          >
            <template v-slot:thumb>
              <text></text>
            </template>
            <template v-slot:extra>
              <tm-text :font-size="22" _class="opacity-7" :label="item.description"></tm-text>
            </template>
          </tm-coupon>
        </view>
      </template>
      <!--        已使用-->
      <template v-if="currentIndex === 2">
        <view v-for="item in usedCouponList" :key="item.couponId">
          <tm-coupon
            :priceDetail="{
              price: item.couponType === 1 ? item.amount : item.discount * 1, //价格金额
              suffix: item.couponType === 1 ? '元' : '折', //后缀文本
              prefix: '', //前缀文本
              subtext: '' //小文本
            }"
            :rightDetail="{
              title: item.couponType === 1 ? item.amount + '元' : item.discount * 1 + '折', //标题
              subtitle: item.name, //副标题
              time: item.expireTime //有效期时间文本
            }"
            disable
            btn-label="已使用"
            @click="itemClick(item)"
            extra
          >
            <template v-slot:thumb>
              <text></text>
            </template>
            <template v-slot:extra>
              <tm-text :font-size="22" _class="opacity-7" :label="item.description"></tm-text>
            </template>
          </tm-coupon>
        </view>
      </template>
    </tm-scrolly>
    <!--    底部导航栏-->
    <tabbar-nav></tabbar-nav>
  </tm-app>
</template>
<script setup lang="ts">
import { useTheme } from '@/hooks/useTheme'
import { findCustomerCouponExpiredPage, findCustomerCouponNotReceivePage, findCustomerCouponUsedPage, receiveCoupon } from '@/api/order'
import { ICoupon } from '@/api/order/types'

const { themeColor } = useTheme()

const currentIndex = ref(0)
const navList = ref([
  {
    id: 0,
    text: '未使用'
  },
  {
    id: 1,
    text: '未领取'
  },
  {
    id: 2,
    text: '已使用'
  }
])
async function itemClick(item: ICoupon) {
  if (currentIndex.value === 0) {
    await uni.switchTab({
      url: '/pages/index/index'
    })
  } else if (currentIndex.value === 1) {
    //   领取优惠券
    await receiveCoupon(item.id)
    //   领取成功
    await uni.showToast({
      title: '领取成功',
      icon: 'none'
    })
    //   从当前列表删除这张优惠券
    noReceiveCouponList.value = noReceiveCouponList.value.filter((coupon) => coupon.id !== item.id)
  } else if (currentIndex.value === 2) {
    // await uni.switchTab({
    //   url: '/pages/index/index'
    // })
  }
}
//#region <下拉刷新，上拉加载>
const refreshStatus = ref(false)
const refreshBottomStatus = ref(false)
// 下拉刷新
async function refresh() {
  refreshStatus.value = true
  console.log('下拉刷新')
  if (currentIndex.value === 0) {
    noUseCouponPageInfo.value.page = 1
    await findCustomerCouponExpiredPageHandle()
  } else if (currentIndex.value === 1) {
    noReceivePageInfo.value.page = 1
    await findCustomerCouponNotReceivePageHandle()
  } else if (currentIndex.value === 2) {
    usedPageInfo.value.page = 1
    await findCustomerCouponUsedPageHandle()
  }
  refreshStatus.value = false
}
// 上拉加载
async function refreshBottom() {
  console.log('上拉加载')
  refreshBottomStatus.value = true
  if (currentIndex.value === 0) {
    if (noUseCouponPageInfo.value.page >= noUseCouponPageInfo.value.pages) {
      refreshBottomStatus.value = false
      return
    }
    noUseCouponPageInfo.value.page++
    await findCustomerCouponExpiredPageHandle()
  } else if (currentIndex.value === 1) {
    if (noReceivePageInfo.value.page >= noReceivePageInfo.value.pages) {
      refreshBottomStatus.value = false
      return
    }
    noReceivePageInfo.value.page++
    await findCustomerCouponNotReceivePageHandle()
  } else if (currentIndex.value === 2) {
    if (usedPageInfo.value.page >= usedPageInfo.value.pages) {
      refreshBottomStatus.value = false
      return
    }
    usedPageInfo.value.page++
    await findCustomerCouponUsedPageHandle()
  }
  refreshBottomStatus.value = false
}

//#region <未使用优惠券列表>
const noUseCouponList = ref<ICoupon[]>([])
const noUseCouponPageInfo = ref({
  page: 1,
  limit: 10,
  pages: 0,
  total: 0
})
async function findCustomerCouponExpiredPageHandle() {
  const res = await findCustomerCouponExpiredPage(noUseCouponPageInfo.value)
  noUseCouponPageInfo.value = {
    page: res.data.page,
    limit: res.data.limit,
    pages: res.data.pages,
    total: res.data.total
  }
  if (res.data.page === 1) {
    noUseCouponList.value = res.data.records
  } else {
    noUseCouponList.value = [...noUseCouponList.value, ...res.data.records]
  }
}
//#endregion
//#region <未领取优惠券列表>
const noReceiveCouponList = ref<ICoupon[]>([])
const noReceivePageInfo = ref({
  page: 1,
  limit: 10,
  pages: 0,
  total: 0
})
async function findCustomerCouponNotReceivePageHandle() {
  const res = await findCustomerCouponNotReceivePage(noUseCouponPageInfo.value)
  noReceivePageInfo.value = {
    page: res.data.page,
    limit: res.data.limit,
    pages: res.data.pages,
    total: res.data.total
  }
  if (res.data.page === 1) {
    noReceiveCouponList.value = res.data.records
  } else {
    noReceiveCouponList.value = [...noReceiveCouponList.value, ...res.data.records]
  }
}
//#endregion
//#region <已使用优惠券列表>
const usedCouponList = ref<ICoupon[]>([])
const usedPageInfo = ref({
  page: 1,
  limit: 10,
  pages: 0,
  total: 0
})
async function findCustomerCouponUsedPageHandle() {
  const res = await findCustomerCouponUsedPage(noUseCouponPageInfo.value)
  usedPageInfo.value = {
    page: res.data.page,
    limit: res.data.limit,
    pages: res.data.pages,
    total: res.data.total
  }
  if (res.data.page === 1) {
    usedCouponList.value = res.data.records
  } else {
    usedCouponList.value = [...usedCouponList.value, ...res.data.records]
  }
}
//#endregion

// 监控currentIndex
watch(
  currentIndex,
  async (val) => {
    if (val === 0) {
      if (!noUseCouponList?.value?.length || noUseCouponPageInfo.value.page === 1) {
        noUseCouponPageInfo.value.page = 1
        await findCustomerCouponExpiredPageHandle()
      }
    } else if (val === 1) {
      if (!noReceiveCouponList?.value?.length || noReceivePageInfo.value.page === 1) {
        noReceivePageInfo.value.page = 1
        await findCustomerCouponNotReceivePageHandle()
      }
    } else if (val === 2) {
      if (!usedCouponList?.value?.length || usedPageInfo.value.page === 1) {
        usedPageInfo.value.page = 1
        await findCustomerCouponUsedPageHandle()
      }
    }
  },
  { immediate: true }
)

//#endregion
onShow(() => {
  // 隐藏tabbar
  uni.hideTabBar()
})
</script>

<style scoped></style>
