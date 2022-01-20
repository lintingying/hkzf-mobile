import React, { Component } from 'react'
import { Dropdown, Popup, Button, PickerView, CascadePickerView } from 'antd-mobile'
import { DownFill } from 'antd-mobile-icons'
import styles from './index.module.css';
import { API } from '../../../../utils/api'


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
            subway: {},
            rentType: [],
            price: []
        }
    }
    setVisible = (v) => {
        this.setState({ visible: v });
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
    setValue = (name, value) => {
        this.setState({
            selectData: {
                ...this.state.selectData,
                [name]: value
            }
        })
    }
    // 子组件传值给父组件
    getData = () => {
        this.props.getData(this.state.selectData)
    }
    componentDidMount() {
        this.getFiltersData();
    }
    render() {
        return (
            <div className={styles.filter}>
                <Dropdown>
                    <Dropdown.Item key='area' title='区域'>
                        <CascadePickerView value={this.state.selectData.area} options={this.state.filtersData.area.children} onChange={val => this.setValue('area', val)} />
                        <Button onClick={this.getData}>确定</Button>
                    </Dropdown.Item>
                    <Dropdown.Item key='type' title='方式'>
                        <PickerView value={this.state.selectData.rentType} columns={[this.state.filtersData.rentType]} onChange={val => this.setValue('rentType', val)} />
                        <Button onClick={this.getData}>确定</Button>
                    </Dropdown.Item>
                    <Dropdown.Item key='money' title='租金'>
                        <PickerView value={this.state.selectData.price} columns={[this.state.filtersData.price]} onChange={val => this.setValue('price', val)} />
                        <Button onClick={this.getData}>确定</Button>
                    </Dropdown.Item>
                    {/* <Dropdown.Item key='more' title='筛选'>
                    </Dropdown.Item> */}
                </Dropdown>
                <div className={styles.more} onClick={() => { this.setVisible(true) }}>
                    <span>筛选 </span>
                    <span className={styles.icon}><DownFill /></span>
                </div>
                <Popup visible={this.state.visible} position='right'
                    bodyStyle={{ minWidth: '60vw' }}
                    onMaskClick={() => {
                        this.setVisible(false)
                    }}
                >
                    <Button>jj</Button>
                </Popup>
            </div>
        )
    }
}
