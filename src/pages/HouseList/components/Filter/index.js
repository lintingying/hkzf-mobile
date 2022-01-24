import React, { Component, useRef, useState } from 'react'
import { Dropdown, Grid, Popup, Button, PickerView, CascadePickerView, Selector } from 'antd-mobile'
import { DownFill } from 'antd-mobile-icons'
import styles from './index.module.css';
import { API } from '../../../../utils/api'

const Drop = ({ filtersData, getData }) => {
    const ref = useRef(null)
    const [area, setArea] = useState([]);
    const [rentType, setRentType] = useState([]);
    const [price, setPrice] = useState([]);

    return (
        <Dropdown ref={ref}>
            <Dropdown.Item key='area' title='区域'>
                <CascadePickerView value={area} options={[filtersData.area, filtersData.subway]} onChange={val => setArea(val)} />
                <Button color='primary' block
                    onClick={() => {
                        getData({ area, rentType, price }) // 子组件Drop向父组件传值
                        ref.current?.close()
                    }}
                >
                    确定
                </Button>
            </Dropdown.Item>
            <Dropdown.Item key='type' title='方式'>
                <PickerView value={rentType} columns={[filtersData.rentType]} onChange={val => setRentType(val)} />
                <Button color='primary' block
                    onClick={() => {
                        getData({ area, rentType, price }) // 子组件Drop向父组件传值
                        ref.current?.close()
                    }}
                >
                    确定
                </Button>
            </Dropdown.Item>
            <Dropdown.Item key='money' title='租金'>
                <PickerView value={price} columns={[filtersData.price]} onChange={val => setPrice(val)} />
                <Button color='primary' block
                    onClick={() => {
                        getData({ area, rentType, price }) // 子组件Drop向父组件传值
                        ref.current?.close()
                    }}
                >
                    确定
                </Button>
            </Dropdown.Item>
        </Dropdown>
    )
}

export default class Filter extends Component {
    state = {
        visible: false,
        filtersData: {
            roomType: [],
            oriented: [],
            floor: [],
            characteristic: [],
            area: {},
            subway: {},
            rentType: [],
            price: []
        },
        selectData: {
            roomType: [],
            oriented: [],
            floor: [],
            characteristic: [],
            area: [],
            rentType: [],
            price: []
        }
    }
    setVisible = (v) => {
        this.setState({ visible: v });
    }
    // 筛选-确定按钮
    moreConfirm = () => {
        this.setVisible(false)
        // 子组件Filter传值给父组件
        this.props.getData(this.state.selectData)
    }
    // 筛选-清除按钮
    moreCancel = () => {
        const data = {
            roomType: [],
            floor: [],
            oriented: [],
            characteristic: []
        }
        this.setData(data)
    }
    // 筛选
    setData(data) {
        this.setState({
            selectData: {
                ...this.state.selectData,
                ...data
            }
        })
    }
    getData = (selectData) => {
        this.setState({
            selectData: {
                ...this.state.selectData,
                ...selectData
            }
        }, () => {
            // 子组件Filter传值给父组件
            this.props.getData(this.state.selectData)
        })
    }

    // 封装获取所有筛选条件的方法
    async getFiltersData() {
        // 获取当前定位城市id
        const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
        const res = await API.get(`/houses/condition?id=${value}`)

        this.setState({
            filtersData: res.data.body
        })
    }
    componentDidMount() {
        this.getFiltersData();
    }
    render() {
        return (
            <div className={styles.filter}>
                <Drop filtersData={this.state.filtersData} getData={this.getData}></Drop>
                <div className={styles.more} onClick={() => { this.setVisible(true) }}>
                    <span>筛选 </span>
                    <span className={styles.icon}><DownFill /></span>
                </div>
                <Popup visible={this.state.visible} position='right' bodyStyle={{ width: '70vw' }}
                    onMaskClick={() => { this.setVisible(false) }}
                >
                    <h3 className={styles.title}>户型</h3>
                    <Selector
                        className={styles.option}
                        options={this.state.filtersData.roomType}
                        value={this.state.selectData.roomType}
                        multiple={true}
                        onChange={(arr) => this.setData({ roomType: arr })}
                    />
                    <h3 className={styles.title}>朝向</h3>
                    <Selector
                        className={styles.option}
                        options={this.state.filtersData.oriented}
                        value={this.state.selectData.oriented}
                        multiple={true}
                        onChange={(arr) => this.setData({ oriented: arr })}
                    />
                    <h3 className={styles.title}>楼层</h3>
                    <Selector
                        className={styles.option}
                        options={this.state.filtersData.floor}
                        value={this.state.selectData.floor}
                        multiple={true}
                        onChange={(arr) => this.setData({ floor: arr })}
                    />
                    <h3 className={styles.title}>房屋亮点</h3>
                    <Selector
                        className={styles.option}
                        options={this.state.filtersData.characteristic}
                        value={this.state.selectData.characteristic}
                        multiple={true}
                        onChange={(arr) => this.setData({ characteristic: arr })}
                    />
                    <div className={styles.moreBtn}>
                        <Grid columns={3} gap={0}>
                            <Grid.Item>
                                <Button block shape='rectangular' onClick={() => { this.moreCancel() }}>
                                    清除
                                </Button>
                            </Grid.Item>
                            <Grid.Item span={2}>
                                <Button color='primary' block shape='rectangular' onClick={() => { this.moreConfirm() }}>
                                    确定
                                </Button>
                            </Grid.Item>
                        </Grid>
                    </div>
                </Popup>
            </div>
        )
    }
}
