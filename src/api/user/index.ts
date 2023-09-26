import http from '@/http'
import { UpdateUserInfoInterface, UserInfoInterface, WxUpdatePhoneInterface } from '@/api/user/types'
/**
 * @description 小程序登录
 * @param  {string} code
 */
export function getLogin(code: string) {
  return http.get<string>(`/customer/login/${code}`)
}
/**
 * @description 获取用户登陆信息
 */
export function getUserInfo() {
  return http.get<UserInfoInterface>('/customer/getCustomerLoginInfo')
}
/**
 * @description 更新用户信息
 */
export function updateUserInfo(userInfo: UpdateUserInfoInterface) {
  return http.post('/customer/updateCustomerInfo')
}

/**
 * @description 更新用户手机号（通过微信）
 * @param  {WxUpdatePhoneInterface} params
 */
export function updateUserPhoneByWx(params: WxUpdatePhoneInterface) {
  return http.post('/customer/updateWxPhone', params)
}
