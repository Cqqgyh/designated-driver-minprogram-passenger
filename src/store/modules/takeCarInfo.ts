import { defineStore } from 'pinia'
import startImgUrl from '@/static/images/start.png'
import endImgUrl from '@/static/images/end.png'
import carImgUrl from '@/static/images/car.png'
import driver from '@/static/images/driver.png'
import { getCarLocation, getDriverInfo, getExpectOrder, getOrderServiceLastLocation, getOrderStatus, submitOrder } from '@/api/order'
import { IDriverInfo, IMarkersItem, IOrderStatusCallback, IPolylineItem } from '@/api/order/types'
import { TimerClass } from '@/class/timerClass'
import { OrderStatus } from '@/config/constEnums'
function formatPolyline(polyline: any[]) {
  const coors = polyline
  const pl = []
  //坐标解压（返回的点串坐标，通过前向差分进行压缩）
  const kr = 1000000
  for (let i = 2; i < coors.length; i++) {
    coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr
  }
  //将解压后的坐标放入点串数组pl中
  for (let i = 0; i < coors.length; i += 2) {
    pl.push({
      longitude: coors[i + 1],
      latitude: coors[i]
    })
  }
  return pl
}
export const useTakeCarInfoStore = defineStore({
  id: 'app-take-car-info',
  state: () => ({
    // 存放查询司机位置的轮询定时器实例:出发位置-> 目的地
    timer: null as unknown as TimerClass | null,
    // 出发地
    from: {
      address: '',
      longitude: 0,
      latitude: 0
    },
    // 目的地
    to: {
      address: '',
      longitude: 0,
      latitude: 0
    },
    // 路线信息
    RouteInfo: {
      // 路线规划
      polyline: [] as IPolylineItem[],
      // 路线距离 方案整体距离（米）
      distance: 0,
      // 路线时间 方案估算时间（分钟）
      duration: 0,
      // 路线费用 方案整体花费（元）
      totalAmount: 0,
      // 路线标记点
      markers: [] as IMarkersItem[]
    },
    //   乘坐的车辆信息
    carInfo: {
      driverInfo: {
        wxOpenId: '',
        name: '',
        gender: '',
        avatarUrl: '',
        driverLicenseAge: 0,
        orderCount: 0,
        score: 0
      } as IDriverInfo,
      // 存放查询司机位置的轮询定时器实例:司机位置->出发位置
      timer: null as unknown as TimerClass | null,
      // 出发地
      from: {
        address: '',
        longitude: 0,
        latitude: 0
      },
      // 目的地
      to: {
        address: '',
        longitude: 0,
        latitude: 0
      },
      // 路线信息
      RouteInfo: {
        // 路线规划
        polyline: [] as any[],
        // 路线距离 方案整体距离（米）
        distance: 0,
        // 路线时间 方案估算时间（分钟）
        duration: 0,
        // 路线标记点
        markers: [] as any[]
      }
    },
    //   订单相关信息
    orderInfo: {
      // 存放查询订单状态的轮询定时器实例
      timer: null as unknown as TimerClass | null,
      // 订单id
      orderId: 0,
      // 订单状态
      orderStatus: 0 as OrderStatus
    }
  }),
  actions: {
    // 设置订单id
    setOrderId(orderId: typeof this.orderInfo.orderId) {
      this.orderInfo.orderId = orderId
    },
    // 设置订单状态
    setOrderStatus(orderStatus: typeof this.orderInfo.orderStatus) {
      this.orderInfo.orderStatus = orderStatus
    },
    // 重置订单相关信息
    resetOrderInfo() {
      this.stopQueryOrderStatus()
      this.orderInfo = {
        timer: null,
        orderId: 0,
        orderStatus: 0
      }
    },
    // 设置出发地
    setFrom(from: typeof this.from) {
      this.from = from
    },
    // 设置目的地
    setTo(to: typeof this.to) {
      this.to = to
    },
    // 设置出发地和目的地
    setFromAndTo(position: Pick<typeof this, 'from' | 'to'>) {
      this.from = position.from
      this.to = position.to
    },
    // 重置出发地
    resetFrom() {
      this.from = {
        address: '',
        longitude: 0,
        latitude: 0
      }
    },
    // 重置目的地
    resetTo() {
      this.to = {
        address: '',
        longitude: 0,
        latitude: 0
      }
    },
    // 重置出发地和目的地
    resetFromAndTo() {
      this.resetFrom()
      this.resetTo()
    },
    // 设置路线信息
    setRouteInfo(RouteInfo: typeof this.RouteInfo) {
      this.RouteInfo = RouteInfo
    },
    // 重置路线信息
    resetRouteInfo() {
      this.RouteInfo = {
        // 路线规划
        polyline: [],
        // 路线距离 方案整体距离（KM）
        distance: 0,
        // 路线时间 方案估算时间（分钟）
        duration: 0,
        // 路线费用 方案整体花费（元）
        totalAmount: 0,
        // 路线标记点
        markers: []
      }
    },
    // 重置出发地和目的地以及路线信息
    resetFromAndToAndRouteInfo() {
      // 停止轮询查询司机位置信息:司机位置->出发位置
      this.stopQueryCarLocationToEndPosition()
      this.resetFromAndTo()
      this.resetRouteInfo()
    },
    // 路径规划
    async routePlan(type: 1 | 2 = 1) {
      const { from, to } = this
      const params = {
        startPointLongitude: from.longitude,
        startPointLatitude: from.latitude,
        endPointLongitude: to.longitude,
        endPointLatitude: to.latitude
      }
      // 从后台获取路径规划信息
      const res = await getExpectOrder(params)
      console.log('res', res)
      const route = res.data.drivingLineVo
      const duration = route.duration
      const distance = route.distance
      const polyline = [
        {
          points: formatPolyline(route.polyline),
          width: 6,
          color: '#05B473',
          arrowLine: true
        }
      ]
      const markers = [
        {
          id: 1,
          latitude: from.latitude,
          longitude: from.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: type === 1 ? startImgUrl : carImgUrl
        },
        {
          id: 2,
          latitude: to.latitude,
          longitude: to.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: endImgUrl
        }
      ]
      const totalAmount = res.data.feeRuleResponseVo.totalAmount
      console.log('totalAmount', totalAmount)
      this.setRouteInfo({
        polyline,
        distance,
        duration,
        totalAmount,
        markers
      })
      console.log('this.RouteInfo', this.RouteInfo)
    },
    // 提交订单
    async submitOrderHandle() {
      const params = {
        startLocation: this.from.address,
        startPointLongitude: this.from.longitude,
        startPointLatitude: this.from.latitude,
        endLocation: this.to.address,
        endPointLongitude: this.to.longitude,
        endPointLatitude: this.to.latitude
      }
      const res = await submitOrder(params)
      //   设置订单id
      this.setOrderId(res.data)
    },
    // 查询订单状态
    async getOrderStatusHandle() {
      const res = await getOrderStatus(this.orderInfo.orderId)
      //   设置订单状态
      this.setOrderStatus(res.data)
    },
    // 轮询查询订单状态
    async queryOrderStatus(settingCallback: IOrderStatusCallback = {}) {
      if (this.orderInfo.timer) return
      this.stopQueryOrderStatus()
      this.orderInfo.timer = new TimerClass({
        time: 3000,
        callback: async () => {
          await this.getOrderStatusHandle()
          switch (this.orderInfo.orderStatus) {
            //   { label: '等待接单', value: OrderStatus.WAITING_ACCEPT },
            // { label: '已接单', value: OrderStatus.ACCEPTED },
            // { label: '司机已到达', value: OrderStatus.DRIVER_ARRIVED },
            // { label: '更新代驾车辆信息', value: OrderStatus.UPDATE_CART_INFO },
            // { label: '开始服务', value: OrderStatus.START_SERVICE },
            // { label: '结束服务', value: OrderStatus.END_SERVICE },
            // { label: '待付款', value: OrderStatus.UNPAID },
            // { label: '已付款', value: OrderStatus.PAID },
            // { label: '系统取消订单', value: OrderStatus.CANCEL_ORDER }
            case OrderStatus.WAITING_ACCEPT:
              console.log('OrderStatus.WAITING_ACCEPT')
              if (settingCallback.WAITING_ACCEPT) {
                settingCallback.WAITING_ACCEPT()
                delete settingCallback.WAITING_ACCEPT
              }
              break
            case OrderStatus.ACCEPTED:
              // 司乘同显
              console.log('OrderStatus.ACCEPTED')
              if (settingCallback.ACCEPTED) {
                settingCallback.ACCEPTED()
                delete settingCallback.ACCEPTED
              }
              break
            case OrderStatus.DRIVER_ARRIVED:
              console.log('OrderStatus.DRIVER_ARRIVED')
              if (settingCallback.DRIVER_ARRIVED) {
                settingCallback.DRIVER_ARRIVED()
                delete settingCallback.DRIVER_ARRIVED
              }
              break
            case OrderStatus.UPDATE_CART_INFO:
              console.log('OrderStatus.UPDATE_CART_INFO')
              if (settingCallback.UPDATE_CART_INFO) {
                settingCallback.UPDATE_CART_INFO()
                delete settingCallback.UPDATE_CART_INFO
              }
              break
            case OrderStatus.START_SERVICE:
              console.log('OrderStatus.START_SERVICE', settingCallback.START_SERVICE)
              if (settingCallback.START_SERVICE) {
                settingCallback.START_SERVICE()
                delete settingCallback.START_SERVICE
              }
              break
            case OrderStatus.END_SERVICE:
              console.log('OrderStatus.END_SERVICE')
              if (settingCallback.END_SERVICE) {
                settingCallback.END_SERVICE()
                delete settingCallback.END_SERVICE
              }
              break
            case OrderStatus.UNPAID:
              console.log('OrderStatus.UNPAID')
              if (settingCallback.UNPAID) {
                settingCallback.UNPAID()
                delete settingCallback.UNPAID
              }
              break
            case OrderStatus.PAID:
              console.log('OrderStatus.PAID')
              if (settingCallback.PAID) {
                settingCallback.PAID()
                delete settingCallback.PAID
              }
              break
            case OrderStatus.CANCEL_ORDER:
              console.log('OrderStatus.CANCEL_ORDER')
              if (settingCallback.CANCEL_ORDER) {
                settingCallback.CANCEL_ORDER()
                delete settingCallback.CANCEL_ORDER
              }
              break
            default:
              console.log('default')
          }
        }
      })
      //   启动轮询
      this.orderInfo.timer.start()
    },
    stopQueryOrderStatus() {
      this.orderInfo.timer?.stop()
      this.orderInfo.timer = null
    },
    // 设置司机信息
    setCarDriverInfo(driverInfo: typeof this.carInfo.driverInfo) {
      this.carInfo.driverInfo = driverInfo
    },
    // 设置车辆起始位置
    setCarPosition(position: Pick<typeof this.carInfo, 'from' | 'to'>) {
      this.carInfo.from = position.from
      this.carInfo.to = position.to
    },
    // 获取司机位置:type 1 设置司机位置->出发地 2 设置出发地->目的地
    async getCarLocationHandle(type: 1 | 2 = 1) {
      if (type === 1) {
        console.log('getCarLocationHandle-type', 1)
        const res = await getCarLocation(this.orderInfo.orderId)
        const position = res.data
        this.setCarPosition({
          // 出发地
          from: {
            address: '',
            longitude: position.longitude,
            latitude: position.latitude
            // longitude: res.data.longitude,
            // latitude: res.data.latitude
          },
          // 目的地
          to: this.to
        })
      }
      if (type === 2) {
        console.log('getCarLocationHandle-type', 2)
        const res = await getOrderServiceLastLocation(this.orderInfo.orderId)
        const position = res.data
        this.setFromAndTo({
          // 出发地
          from: {
            address: this.from.address,
            longitude: position.longitude,
            latitude: position.latitude
          },
          // 目的地
          to: this.to
        })
      }
    },
    // 获取司机信息
    async getDriverInfoHandle() {
      const res = await getDriverInfo(this.orderInfo.orderId)
      //   设置订单状态
      this.setCarDriverInfo(res.data)
    },
    // 轮询查询司机位置：司机位置->出发位置
    async queryCarLocationToStartPosition(callback: () => void = () => {}) {
      if (this.carInfo.timer) return
      this.stopQueryCarLocationToStartPosition()
      this.carInfo.timer = new TimerClass({
        time: 6000,
        callback: async () => {
          // 获取司机位置
          await this.getCarLocationHandle()
          // 更新路线
          await this.driversPickUpPassengersRoutePlan()
          callback()
        }
      })
      //   启动轮询
      this.carInfo.timer.start()
    },
    // 轮询查询司机位置：出发位置->目的地
    async queryCarLocationToEndPosition(callback: () => void = () => {}) {
      console.log('queryCarLocationToEndPosition', this.timer)
      if (this.timer) return
      this.stopQueryCarLocationToStartPosition()
      this.timer = new TimerClass({
        time: 6000,
        callback: async () => {
          // 获取司机位置
          await this.getCarLocationHandle(2)
          // 更新路线
          await this.routePlan(2)
          callback()
        }
      })
      //   启动轮询
      this.timer.start()
    },
    // 停止轮询查询司机位置信息:司机位置->出发位置
    stopQueryCarLocationToStartPosition() {
      this.carInfo.timer?.stop()
      this.carInfo.timer = null
    },
    // 停止轮询查询司机位置信息:出发位置->目的地
    stopQueryCarLocationToEndPosition() {
      this.timer?.stop()
      this.timer = null
    },
    //   设置乘坐的车辆信息
    setCarRouteInfo(RouteInfo: typeof this.carInfo.RouteInfo) {
      this.carInfo.RouteInfo = RouteInfo
    },
    // 重置乘坐的车辆信息
    resetCarInfo() {
      this.stopQueryCarLocationToStartPosition()
      this.carInfo = {
        timer: null,
        driverInfo: {
          wxOpenId: '',
          name: '',
          gender: '',
          avatarUrl: '',
          driverLicenseAge: 0,
          orderCount: 0,
          score: 0
        },
        // 出发地
        from: {
          address: '',
          longitude: 0,
          latitude: 0
        },
        // 目的地
        to: {
          address: '',
          longitude: 0,
          latitude: 0
        },
        // 路线信息
        RouteInfo: {
          // 路线规划
          polyline: [] as any[],
          // 路线距离 方案整体距离（米）
          distance: 0,
          // 路线时间 方案估算时间（分钟）
          duration: 0,
          // 路线标记点
          markers: [] as any[]
        }
      }
    },
    //   规划司机接乘客路径CarInfo
    async driversPickUpPassengersRoutePlan() {
      const from = this.carInfo.from
      const to = this.from
      const params = {
        startPointLongitude: from.longitude,
        startPointLatitude: from.latitude,
        endPointLongitude: to.longitude,
        endPointLatitude: to.latitude
      }
      // 从后台获取路径规划信息
      const res = await getExpectOrder(params)
      console.log('res', res)
      const route = res.data.drivingLineVo
      const duration = route.duration
      const distance = route.distance
      const polyline = [
        {
          points: formatPolyline(route.polyline),
          width: 6,
          color: '#05B473',
          arrowLine: true
        }
      ]
      const markers = [
        {
          id: 1,
          latitude: from.latitude,
          longitude: from.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: driver
        },
        {
          id: 2,
          latitude: to.latitude,
          longitude: to.longitude,
          width: 25,
          height: 35,
          anchor: {
            x: 0.5,
            y: 0.5
          },
          iconPath: endImgUrl
        }
      ]
      this.setCarRouteInfo({
        polyline,
        distance,
        duration,
        markers
      })
    }
  }
})
