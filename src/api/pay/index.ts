import http from '@/http'
import type { IPayParams, IWechatPayInterface } from '@/api/pay/types'

/**
 * @description 微信下单接口
 * @param {IPayParams} params
 */
export function wechatPay(params: IPayParams) {
  return http.post<IWechatPayInterface>('/order/createWxPayment', params)
}

/**
 * @description 查询订单支付状态
 * @param {string} orderNo 订单号
 */
export function queryOrderPayStatus(orderNo: string | number) {
  return http.get(`/order/queryPayStatus/${orderNo}`)
}
