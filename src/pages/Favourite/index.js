import React, { Component } from 'react'
import HouseItem from '../../components/HouseItem'
import NavHeader from '../../components/NavHeader'
import { Toast } from 'antd-mobile'
import { API } from '../../utils/api'
import styles from './index.module.css'

export default class Favourite extends Component {
    state = {
        list: []
    }

    // 用来获取收藏的房屋列表数据
    async getFavouriteHouseList() {
        // 开启loading
        Toast.show({ icon: 'loading', content: '加载中…' });
        const res = await API.get('/user/favorites')
        // 关闭loading
        Toast.clear()

        this.setState({
            list: res.data.body,
        })
    }
    renderList() {
        return this.state.list.map(house => (
            <HouseItem key={house.houseCode} data={house} />
        ))
    }
    componentDidMount() {
        this.getFavouriteHouseList()
    }

    render() {
        return (
            <div className={styles.favourites}>
                <NavHeader>我的收藏</NavHeader>
                <div className={styles.houseItems}>{this.renderList()}</div>
            </div>
        )
    }
}
