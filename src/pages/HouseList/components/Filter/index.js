import React, { Component, useRef, useState } from 'react'
import { Dropdown, Popup, Button, PickerView, CascadePickerView, Selector } from 'antd-mobile'
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
            subway: [],
            rentType: [],
            price: []
        }
    }
    moreData
    setVisible = (v) => {
        this.setState({ visible: v });
    }
    // 筛选-确定按钮
    moreConfirm = () => {
        this.setVisible(false)
        this.getData(this.moreData)
    }
    // 筛选
    setMoreData(data) {
        this.moreData = { ...this.moreData, ...data }
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
                        multiple={true}
                        onChange={(arr) => this.setMoreData({ roomType: arr })}
                    />
                    <h3 className={styles.title}>朝向</h3>
                    <Selector
                        className={styles.option}
                        options={this.state.filtersData.oriented}
                        multiple={true}
                        onChange={(arr) => this.setMoreData({ oriented: arr })}
                    />

                    <h3 className={styles.title}>楼层</h3>
                    <Selector
                        className={styles.option}
                        options={this.state.filtersData.floor}
                        multiple={true}
                        onChange={(arr) => this.setMoreData({ floor: arr })}
                    />
                    <h3 className={styles.title}>房屋亮点</h3>
                    <Selector
                        className={styles.option}
                        options={this.state.filtersData.characteristic}
                        multiple={true}
                        onChange={(arr) => this.setMoreData({ characteristic: arr })}
                    />
                    <Button className={styles.moreBtn} color='primary' block onClick={() => { this.moreConfirm() }}>
                        确定
                    </Button>
                </Popup>
            </div>
        )
    }
}
