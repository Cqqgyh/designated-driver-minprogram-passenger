// 数据字典接口
export interface IMapProps{
//   longitude 	Number 		中心经度
//   latitude 	Number 		中心纬度
//   scale 	Number 	16 	缩放级别，取值范围为3-20 	高德地图缩放比例与微信小程序不同
//   theme 	String 	normal 	主题（satellite 或 normal）只在初始化时有效，不能动态变更（仅Android支持） 	京东小程序
//   min-scale 	Number 	3 	最小缩放级别 	App-nvue 3.1.0+、微信小程序2.13+
//   max-scale 	Number 	20 	最大缩放级别 	App-nvue 3.1.0+、微信小程序2.13+
//   layer-style 	Number/String 	1 	个性化地图 	App-nvue 3.1.0+、微信小程序2.13+
//   markers 	Array 		标记点
//   polyline 	Array 		路线 	飞书小程序不支持
//   circles 	Array 		圆
//   controls 	Array 		控件
//   include-points 	Array 		缩放视野以包含所有给定的坐标点 	App-nvue 2.1.5+、微信小程序、H5、百度小程序、支付宝小程序、京东小程序
//   enable-3D 	Boolean 	false 	是否显示3D楼块 	App-nvue 2.1.5+、微信小程序2.3.0
//   show-compass 	Boolean 	false 	是否显示指南针 	App-nvue 2.1.5+、微信小程序2.3.0
//   enable-zoom 	Boolean 	true 	是否支持缩放 	App-nvue 2.1.5+、微信小程序2.3.0
//   enable-scroll 	Boolean 	true 	是否支持拖动 	App-nvue 2.1.5+、微信小程序2.3.0
//   enable-rotate 	Boolean 	false 	是否支持旋转 	App-nvue 2.1.5+、微信小程序2.3.0
//   enable-overlooking 	Boolean 	false 	是否开启俯视 	App-nvue 2.1.5+、微信小程序2.3.0
//   enable-satellite 	Boolean 	false 	是否开启卫星图 	App-nvue 2.1.5+、微信小程序2.7.0
//   enable-traffic 	Boolean 	false 	是否开启实时路况 	App-nvue 2.1.5+、微信小程序2.7.0
//   enable-poi 	Boolean 	false 	是否展示 POI 点 	App-nvue 3.1.0+
//   enable-building 	Boolean 	false 	是否展示建筑物 	App-nvue 3.1.0+ 支持 (废除原enable-3D属性 高德地图默认开启建筑物就是3D无法设置)
//   show-location 	Boolean 		显示带有方向的当前定位点 	微信小程序、H5、百度小程序、支付宝小程序、京东小程序
//   polygons（支付宝为: polygon） 	Array.<polygon> 		多边形 	App-nvue 2.1.5+、App-vue 3.4.3+、H5 3.4.3+、微信小程序、百度小程序、支付宝小程序
//   enable-indoorMap 	Boolean 	false 	是否展示室内地图 	App-nvue 3.1.0+
//   @markertap 	EventHandle 		点击标记点时触发，e.detail = {markerId} 	App-nvue 2.3.3+、H5、微信小程序、支付宝小程序 （App和H5平台需要指定 marker 对象属性 id）
// @labeltap 	EventHandle 		点击label时触发，e.detail = {markerId} 	微信小程序2.9.0
// @callouttap 	EventHandle 		点击标记点对应的气泡时触发，e.detail = {markerId}
// @controltap 	EventHandle 		点击控件时触发，e.detail = {controlId}
// @regionchange 	EventHandle 		视野发生变化时触发 	微信小程序、H5、百度小程序、支付宝小程序、京东小程序
// @tap 	EventHandle 		点击地图时触发; App-nvue、微信小程序2.9支持返回经纬度
// @updated 	EventHandle 		在地图渲染更新完成时触发 	微信小程序、H5、百度小程序
// @anchorpointtap 	EventHandle 		点击定位标时触发，e.detail = {longitude, latitude} 	App-nvue 3.1.0+、微信小程序2.13+
// @poitap 	EventHandle 		点击地图poi点时触发，e.detail = {name, longitude, latitude} 	微信小程序2.3.0+
  longitude: number
    latitude: number
    scale: number
    theme: string
    minScale: number
    maxScale: number
    layerStyle: number | string
    markers: Array<any>
    polyline: Array<any>
    circles: Array<any>
    controls: Array<any>
    includePoints: Array<any>
    enable3D: boolean
    showCompass: boolean
    enableZoom: boolean
    enableScroll: boolean
    enableRotate: boolean
    enableOverlooking: boolean
    enableSatellite: boolean
    enableTraffic: boolean
    enablePoi: boolean
    enableBuilding: boolean
    showLocation: boolean
    polygons: Array<any>
    enableIndoorMap: boolean
    markertap: Function
    labeltap: Function
    callouttap: Function
    controltap: Function
    regionchange: Function
    tap: Function
    updated: Function
    anchorpointtap: Function
    poitap: Function
}
