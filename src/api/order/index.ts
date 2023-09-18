import http from '@/http'
import { IDriverInfo, IOrderBillInfo, IQueryParams, IRouteInfo, ISubmitOrderParams } from '@/api/order/types'
import { OrderStatus } from '@/config/constEnums'
/**
 * @description 预估订单数据
 * @param params
 */
export function getExpectOrder(params: IQueryParams) {
  // 特殊处理，因为后台设计数据库位置精确到小数点后6位，所以这里也要处理一下
  // params.startPointLongitude = Number(params.startPointLongitude.toFixed(6))
  // params.startPointLatitude = Number(params.startPointLatitude.toFixed(6))
  // params.endPointLongitude = Number(params.endPointLongitude.toFixed(6))
  // params.endPointLatitude = Number(params.endPointLatitude.toFixed(6))
  return http.post<IRouteInfo>('/order/expectOrder', params)
}

/**
 * @description 提交订单
 * @param params
 */
export function submitOrder(params: ISubmitOrderParams) {
  return http.post<number>('/order/submitOrder', params)
}

/**
 * @description 查询订单状态
 * @param orderId
 */
export function getOrderStatus(orderId: number) {
  return http.get<OrderStatus>(`/order/getOrderStatus/${orderId}`)
}

/**
 * @description 司机赶往代驾起始点：获取订单经纬度位置
 * @param orderId
 */
export function getCarLocation(orderId: number) {
  return http.get<{
    longitude: number
    latitude: number
  }>(`/order/getCacheOrderLocation/${orderId}`)
}
/**
 * @description 代驾服务：获取订单服务最后一个位置信息
 * @param orderId
 */
export function getOrderServiceLastLocation(orderId: number) {
  return http.get<{
    longitude: number
    latitude: number
  }>(`/order/getOrderServiceLastLocation/${orderId}`)
}
/**
 * @description 根据订单id获取司机基本信息
 * @param orderId
 */
export function getDriverInfo(orderId: number) {
  return http.get<IDriverInfo>(`/order/getDriverInfo/${orderId}`)
}

/**
 * @description 乘客取消未接单订单
 * @param orderId
 */
export function customerCancelNoAcceptOrder(orderId: number) {
  return http.get(`/order/customerCancelNoAcceptOrder/${orderId}`)
}

/**
 * @description 获取订单账单信息
 * @param orderId
 */
export function getOrderBillInfo(orderId: number) {
  return http.get<IOrderBillInfo>(`/order/getOrderBillInfo/${orderId}`)
}
