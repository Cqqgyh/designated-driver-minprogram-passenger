// 地图属性 https://uniapp.dcloud.net.cn/component/map.html#
export interface IMapProps {
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
  markertap: () => void
  labeltap: () => void
  callouttap: () => void
  controltap: () => void
  regionchange: () => void
  tap: () => void
  updated: () => void
  anchorpointtap: () => void
  poitap: () => void
}
