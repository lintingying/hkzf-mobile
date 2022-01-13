import axios from "axios";
import { BASE_URL } from './url'

/**
 * 获取当前城市
 */
export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('hkzf_city')) 
    if(!localCity) {
        return new Promise((resolve,reject) => {
            // 通过百度地图获取当前城市信息
            const curCity = new window.BMapGL.LocalCity();
            curCity.get(async r => {
                try {
                    // 通过接口判断数据库中是否有当前城市的房源信息，如没有则返回 上海
                    const res = await axios.get(BASE_URL + '/area/info',{
                        params: { name: r.name }
                    });
                    localStorage.setItem('hkzf_city', JSON.stringify(res.data.body))
                    resolve(res.data.body)
                } catch(e) {
                    reject(e)
                }
            })
        })
    }
    // 此处的promise不会失败，用成功的promise就行
    return Promise.resolve(localCity)
}