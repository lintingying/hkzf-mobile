import React, { Component } from 'react'
import SearchHeader from '../../components/SearchHeader';
import { getCurrentCity } from '../../utils/city'
import styles from './index.module.css'
import Filter from './components/Filter';
import { API } from '../../utils/api';
import { Toast } from 'antd-mobile'
import {
    List,
    AutoSizer,
    WindowScroller,
    InfiniteLoader
} from 'react-virtualized'
import HouseItem from '../../components/HouseItem'
import Sticky from '../../components/Sticky'
import { Empty } from 'antd-mobile'

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

    getData = (data) => {
        // 重新旋筛选条件后，应该返回页面顶部
        window.scrollTo(0, 0)
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
    // 渲染房屋列表项
    renderHouseList = ({ key, index, style }) => {
        // 根据索引号来获取当前这一行的房屋数据
        const { list } = this.state
        const house = list[index]
        // 判断 house 是否存在
        // 如果不存在，就渲染 loading 元素占位
        if (!house) {
            return (
                <div key={key} style={style}>
                    <p className={styles.loading} />
                </div>
            )
        }

        return (
            <HouseItem key={house.houseCode} data={house} />
        )
    }
    // 判断列表中的每一行是否加载完成
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index]
    }
    // 用来获取更多房屋列表数据
    // 注意：该方法的返回值是一个 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve 让Promise对象的状态变为已完成。
    loadMoreRows = ({ startIndex, stopIndex }) => {
        return new Promise(resolve => {
            API.get('/houses', {
                params: {
                    cityId: this.curCity.value,
                    ...this.filters,
                    start: startIndex,
                    end: stopIndex
                }
            }).then(res => {
                // console.log('loadMoreRows：', res)
                // 合并数据
                this.setState({
                    list: [...this.state.list, ...res.data.body.list]
                })

                // 数据加载完成时，调用 resolve 即可
                resolve()
            })
        })
    }
    // 渲染列表数据
    renderList() {
        const { count, isLoading } = this.state
        // 关键点：在数据加载完成后，再进行 count 的判断
        // 解决方式：如果数据加载中，则不展示 空 组件；而，但数据加载完成后，再展示 空 组件
        if (count === 0 && !isLoading) {
            return <Empty style={{ padding: '64px 0' }} description='暂无房源' />
        }

        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={count}
            >
                {({ onRowsRendered, registerChild }) => (
                    <WindowScroller>
                        {({ height, isScrolling, scrollTop }) => (
                            <AutoSizer>
                                {({ width }) => (
                                    <List
                                        onRowsRendered={onRowsRendered}
                                        ref={registerChild}
                                        autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                                        width={width} // 视口的宽度
                                        height={height} // 视口的高度
                                        rowCount={count} // List列表项的行数
                                        rowHeight={120} // 每一行的高度
                                        rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        )
    }

    async componentDidMount() {
        // 获取城市 放componentDidMount里，页面展示一次调用一次
        this.curCity = await getCurrentCity();
        this.searchHouseList()
    }
    render() {
        return (
            <div className={styles.houselist}>
                <SearchHeader showBack={true} cityName={this.curCity.label} className={styles.search}></SearchHeader>
                <Sticky height={40}>
                    <Filter getData={this.getData}></Filter>
                </Sticky>
                <div className={styles.houseItems}>{this.renderList()}</div>
            </div>
        )
    }
}

