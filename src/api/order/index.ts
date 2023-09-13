import http from '@/http'
import { IDriverInfo, IQueryParams, IRouteInfo, ISubmitOrderParams } from "@/api/order/types"
import { OrderStatus } from '@/config/constEnums'
/**
 * @description 预估订单数据
 * @param params
 */
export function getExpectOrder(params: IQueryParams) {
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
 * @description 司机赶往代驾起始点：获取订单经纬度位置
 * @param orderId
 */
export function getDriverInfo(orderId: number) {
  return http.get<IDriverInfo>(`/order/getDriverInfo/${orderId}`)
}
