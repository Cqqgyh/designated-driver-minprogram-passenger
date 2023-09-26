// 从后台获取用户信息接口
import { Gender } from '@/config/constEnums'

export interface UserInfoInterface {
  isBindPhone: boolean
  wxOpenId: string
  nickname: string
  gender: Gender
  avatarUrl: string
}
// 更新用户信息接口
export interface UpdateUserInfoInterface {
  avatarUrl?: string
  ender?: Gender
  nickname?: string
}
// 微信登陆返回信息接口
export interface WxLoginResponseInterface {
  openid: string
}
// 微信登陆返回用户信息
export interface WechatUserInfoInterface {
  avatarUrl: string
  city: string
  country: string
  gender: 0 | 1 | 2
  language: string
  nickName: string
  province: string
}
// 更新微信用户手机号
export interface WxUpdatePhoneInterface {
  cloudID: string
  code: string
  iv: string
  encryptedData: string
}
