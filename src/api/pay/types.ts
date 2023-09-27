// 微信支付需要的数据接口
export interface IWechatPayInterface {
  appId: string
  timeStamp: string
  packageVal: string
  paySign: string
  signType: 'MD5' | 'HMAC-SHA256' | 'RSA' | undefined
  nonceStr: string
}
// 后台支付接口所需信息
export interface IPayParams {
  orderNo: number | string
  orderId: number | string
  customerCouponId: number | string
}
