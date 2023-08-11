import {QqMapkey} from "@/config/config";
import QQMapWX from "@/libs/qqmap-wx-jssdk";

console.log('QQMapWX',QQMapWX)
export const useQqMapSdk = () => {
// 实例化API核心类
    const qqmapsdk = new QQMapWX({
        key: QqMapkey
    });
    return{
        qqmapsdk
    }
}
