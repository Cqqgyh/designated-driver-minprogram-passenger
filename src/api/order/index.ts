import http from '@/http'
import {
  ICoupon,
  ICurrentOrderOrder,
  IDriverInfo,
  IOrderBillInfo,
  IOrderDetail,
  IOrderListItem,
  IQueryParams,
  IRouteInfo,
  ISubmitOrderParams
} from "@/api/order/types"
import { OrderStatus } from '@/config/constEnums'
import { PageRes, ReqPage } from '@/api/types'
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

/**
 * @description 获取订单列表分页
 */
export function getOrderListPage(params: ReqPage) {
  return http.get<PageRes<IOrderListItem>>(`/order/findCustomerOrderPage/${params.page}/${params.limit}`)
}

/**
 * @description 获取订单详情
 * @param orderId
 */
export function getOrderDetail(orderId: number | string) {
  return http.get<IOrderDetail>(`/order/getOrderInfo/${orderId}`)
}

/**
 * @description 查找乘客当前订单
 */
export function findCustomerCurrentOrder() {
  return http.get<ICurrentOrderOrder>('/order/searchCustomerCurrentOrder')
}

/**
 * 查询已使用优惠券分页列表
 * @param params
 */
export function findCustomerCouponUsedPage(params: ReqPage) {
  return http.get<PageRes<ICoupon>>(`/coupon/findUsedPage/${params.page}/${params.limit}`)
}

/**
 * 查询未使用优惠券分页列表
 * @param params
 */
export function findCustomerCouponExpiredPage(params: ReqPage) {
  return http.get<PageRes<ICoupon>>(`/coupon/findNoUsePage/${params.page}/${params.limit}`)
}

/**
 * 查询未领取优惠券分页列表
 * @param params
 */
export function findCustomerCouponNotReceivePage(params: ReqPage) {
  return http.get<PageRes<ICoupon>>(`/coupon/findNoReceivePage/${params.page}/${params.limit}`)
}

/**
 * 获取未使用的最佳优惠券信息
 * @param orderId
 */
export function getBestCoupon(orderId: number) {
  return http.get<ICoupon>(`/coupon/findAvailableCoupon/${orderId}`)
}

/**
 * 领取优惠券
 * @param couponId
 */
export function receiveCoupon(couponId: number) {
  return http.get(`/coupon/receive/${couponId}`)
}
