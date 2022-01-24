import React, { Component } from 'react'
import SearchHeader from '../../components/SearchHeader';
import { getCurrentCity } from '../../utils/city'
import styles from './index.module.css'
import Filter from './components/Filter';
import { API } from '../../utils/api';
import { Toast } from 'antd-mobile'

export default class HouseList extends Component {
    state = {
        list: [],
        count: 0,
        // 数据加载完成的状态
        isLoading: false
    }
    curCity = {
        label: '',
        value: ''
    };
    // 过滤条件
    filters = {};
    async getCurCity() {
        this.curCity = await getCurrentCity();
    }

    getData = (data) => {
        // 区域
        if (data.area.length > 0) {
            const areaKey = data.area[0]
            let areaValue = 'null'
            if (data.area.length === 3) {
                areaValue = data.area[2] !== 'null' ? data.area[2] : data.area[1]
            }
            this.filters[areaKey] = areaValue
        }
        // 方式
        if (data.rentType.length > 0) {
            this.filters.rentType = data.rentType[0]
        }
        // 租金
        if (data.price.length > 0) {
            this.filters.price = data.price[0]
        }
        // 更多筛选条件 more
        const more = data.roomType.concat(data.floor, data.oriented, data.characteristic)
        this.filters.more = more.join(',')

        this.searchHouseList()
    }
    // 用来获取房屋列表数据
    async searchHouseList() {
        // 获取当前定位城市id
        this.setState({
            isLoading: true
        })

        // 开启loading
        Toast.show({ icon: 'loading', content: '加载中…' });
        const res = await API.get('/houses', {
            params: {
                cityId: this.curCity.value,
                ...this.filters,
                start: 1,
                end: 20
            }
        })
        const { list, count } = res.data.body
        // 关闭loading
        Toast.clear()

        // 提示房源数量
        // 解决了没有房源数据时，也弹窗提示的bug
        if (count !== 0) {
            Toast.show({ content: `共找到 ${count} 套房源` });
        }

        this.setState({
            list,
            count,
            // 数据加载完成的状态
            isLoading: false
        })
    }
    componentDidMount() {
        this.getCurCity()
        this.searchHouseList()
    }
    render() {
        return (
            <div className={styles.houselist}>
                <SearchHeader showBack={true} cityName={this.curCity.label} className={styles.search}></SearchHeader>
                <Filter getData={this.getData}></Filter>
            </div>
        )
    }
}

