<template>
  <tm-app>
    <map id="map" :longitude="mapProps.longitude" :latitude="mapProps.latitude"  scale="15" :enable-traffic="false" :show-location="true" :enable-poi="true" class="map">
<!--      <cover-image class="location" src="../../static/workbench/location.png" @tap="returnLocationHandle()"></cover-image>-->
      <cover-view class="location">
        <tm-icon :fontSize="50" name="myicon-zhifubao-e607"></tm-icon>
      </cover-view>
    </map>
    <tabbar-nav></tabbar-nav>
  </tm-app>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useQqMapSdk } from '@/hooks/useQqMapSdk'
import {IMapProps} from "@/api/index/types";
const {qqmapsdk} = useQqMapSdk()
//#region <map相关>
const map = uni.createMapContext('map');

const mapProps = ref<Pick<IMapProps,'longitude'|'latitude'>>({
  // 中心经度
  longitude:116.397505,
  // 中心纬度
  latitude: 39.908675,
})
// 出发地
const from = ref({
  address: '',
  longitude: 0,
  latitude: 0
})
// 目的地
const to = ref({
  address: '',
  longitude: 0,
  latitude: 0
})
// 样式
//#endregion
onLoad(() => {
//   获取当前位置信息
  uni.getLocation({
    type: 'gcj02',
    success: function (res) {
      mapProps.value.longitude = res.longitude
      mapProps.value.latitude = res.latitude
    }
  });
})


</script>

<style scoped>
.map{
  width: 100%;
  height: 100vh;
}
.location {
  width: 50rpx;
  height: 50rpx;
  position: absolute;
  right: 45rpx;
  bottom: 300rpx;
}
</style>
