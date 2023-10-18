import { defineStore } from 'pinia'
import { queryOrderPayStatus, wechatPay } from '@/api/pay'
import { IPayParams, IWechatPayInterface } from '@/api/pay/types'

export const usePayStore = defineStore('app-pay', {
  state: () => {
    return {
      orderNo: '' as string | number,
      orderId: '' as string | number,
      customerCouponId: '' as string | number
    }
  },
  actions: {
    // 提交订单
    async submitOrder(params: IPayParams) {
      this.orderNo = params.orderNo
      this.orderId = params.orderId
      this.customerCouponId = params?.customerCouponId || 0
      try {
        await this.wechatPay(params)
        // 查询支付状态
        await this.queryOrderPayStatus(this.orderNo)
      } catch (error) {
        console.log(error)
      }
    },
    // 微信支付逻辑
    async wechatPay(params: IPayParams) {
      // 调用后端微信下单接口
      try {
        const res = await wechatPay(params)
        // 调用微信官方支付接口，同步调用，不要加awit，因为后面微信支付逻辑后有轮询，加了await会阻碍轮询的执行
        await this.wechatOfficialPay(res.data)
      } catch (error) {
        console.log(error)
      }
    },
    // 微信官方支付接口
    async wechatOfficialPay(params: IWechatPayInterface) {
      const wxPayParams = {
        appId: params.appId,
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.packageVal,
        signType: params.signType,
        paySign: params.paySign,
        success: () => {
          console.log('支付成功')
        },
        fail: (err: any) => {
          console.log('支付失败', err)
        }
      }
      console.log('wxPayParams', wxPayParams)
      try {
        console.log('微信官方支付接口---start')
        const res = await wx.requestPayment(wxPayParams)
        console.log('微信官方支付接口---end')
        console.log('支付成功')
      } catch (err) {
        // 支付失败
        console.log('err', err)
      }
    },
    // 查询订单支付状态
    async queryOrderPayStatus(orderNo: string | number, times: number = 100, interval: number = 2000, callback = () => this.paySuccess()) {
      // 轮询查询订单支付状态
      try {
        console.log('轮询查询订单支付状态---start')
        const res = await queryOrderPayStatus(orderNo)
        if (res.data) {
          // 查询支付成功
          callback()
        } else {
          // 查询支付失败
          if (times > 1) {
            console.log('查询支付信息失败，继续查询-----------', times)
            setTimeout(() => {
              this.queryOrderPayStatus(orderNo, times - 1, interval)
            }, interval)
          } else {
            uni.showToast({
              title: '查询支付信息失败',
              icon: 'error',
              duration: 2000
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 支付成功
    paySuccess() {
      setTimeout(() => {
        uni.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
      }, 200)
      // 去往支付成功页面
      console.log('去往支付成功页面')
      //
      uni.redirectTo({
        url: `/pages/paySuccess/paySuccess?orderNo=${this.orderNo}&orderId=${this.orderId}`
      })
      // 清空相关订单信息
      this.clearOrderInfo()
    },
    // 清空相关订单信息
    clearOrderInfo() {
      this.orderNo = '' as string | number
    }
  }
})
