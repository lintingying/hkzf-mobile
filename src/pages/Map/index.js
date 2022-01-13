import React, { Component } from 'react'
// import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmapgl';
import NavHeader from '../../components/NavHeader';
import './index.scss';
import styles from './index.module.css'
import { Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import HouseItem from '../../components/HouseItem';
import { API } from '../../utils/api'

const BMapGL = window.BMapGL;

export default class MyMap extends Component {
    map;
    state = {
        housesList: [],
        isShowList: false,
    }
    /**
     * 初始化地图
     */
    initMap() {
        const { label: cityName, value} = JSON.parse(localStorage.getItem('hkzf_city'))
        this.map = new BMapGL.Map('container');
        //创建地址解析器实例
        const myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(cityName, point => { // point是坐标
            if (point) {
                this.map.centerAndZoom(point, 11);
                this.map.addOverlay(new BMapGL.Marker(point, {title: cityName})); // 红点标注
                this.map.addControl(new BMapGL.ScaleControl());// 添加比例尺控件
                this.map.addControl(new BMapGL.ZoomControl());  // 添加缩放控件
                this.renderOverlays(value); // 渲染覆盖物
            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, cityName);

        // 给地图绑定移动事件
        this.map.addEventListener('movestart', () => {
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }
        })
    }
    
    async renderOverlays(id) {
        try {
            Toast.show({ icon: 'loading', content: '加载中…' });
            const res = await API.get('/area/map', { params: {id: id}});
            Toast.clear();
            const {nextZoom,type} = this.getTypeAndZoom();
            // 创建覆盖物
            res.data.body.forEach(item => {
                this.createOverlays(item,nextZoom,type)
            });
        } catch (error) {
            Toast.clear();
        }
    }
    // 获取当前缩放级别,覆盖物类型
    getTypeAndZoom() {
        const zoom = this.map.getZoom();
        let nextZoom,type;
        if(zoom >= 10 && zoom < 12) { // 市区
            nextZoom = 13
            type = 'circle'
        } else if(zoom >= 12 && zoom < 14){// 镇
            nextZoom = 15
            type = 'circle'
        } else if(zoom >= 12 && zoom < 14){ // 小区
            type = 'rect'
        }
        return {nextZoom,type}
    }
    createOverlays(data, zoom, type) {
        const { coord: { latitude, longitude }, count, label: areaName, value  } = data;
        const areaOpint = new BMapGL.Point(longitude, latitude);
        if (type === 'circle') {
            this.createCircle(areaOpint,count, areaName, value, zoom);
        } else {
            this.createRect(areaOpint,count, areaName, value);
        }
    }

    createCircle(areaOpint,count, areaName, id, zoom) {
        // 创建文本标注对象
        const label = new BMapGL.Label('',  {
            position: areaOpint, // 指定文本标注所在的地理位置
            // offset: new BMapGL.Size(30, -30) // 设置文本偏移量
        });
        // 设置覆盖物内容
        label.setContent(`
            <div>${areaName}</div>
            <div>${count}</div>
        `)
        // 自定义文本标注样式
        label.setStyle({
            color: 'blue',
            borderRadius: '30px',
            borderColor: '#ccc',
            padding: '10px',
            fontSize: '16px',
            height: '60px',
            width: '60px',
            // lineHeight: '50px',
            fontFamily: '微软雅黑'
        });
        // 覆盖物添加id标识
        label.id = id;
        // 添加单击事件
        label.addEventListener('click', () => {
            // 点击覆盖物，渲染下一级
            this.renderOverlays(id);
            // 放大地图，作为中心
            this.map.centerAndZoom(areaOpint, zoom);
            this.map.clearOverlays()

        })
        // 将覆盖物添加到地图
        this.map.addOverlay(label);
    }
    createRect(areaOpint,count, areaName, id) {
        // 创建文本标注对象
        const label = new BMapGL.Label('',  {
            position: areaOpint, // 指定文本标注所在的地理位置
            // offset: new BMapGL.Size(30, -30) // 设置文本偏移量
        });
        // 设置覆盖物内容
        label.setContent(`
            <div>${areaName} ${count}</div>
        `)
        // 自定义文本标注样式
        label.setStyle({
            color: 'green',
            borderColor: '#ccc',
            padding: '5px',
            fontSize: '16px',
            height: '30px',
            width: '160px',
            fontFamily: '微软雅黑'
        });
        // 覆盖物添加id标识
        label.id = id;
        // 添加单击事件
        label.addEventListener('click', e => {
            // 最后一级，获取房源数据
            this.getHouseList();
            // 获取当前被点击项e.changedTouches没有
            // const target = e.changedTouches[0]
            // this.map.panBy(
            //     window.innerWidth / 2 - target.clientX,
            //     (window.innerHeight - 330) / 2 - target.clientY
            // )
        })
        this.map.addEventListener('click', e => {
            const target = e.clientPos
            this.map.panBy(
                window.innerWidth / 2 - target.x,
                (window.innerHeight - 330) / 2 - target.y
            )
        })
        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }
    // 获取房源数据
    async getHouseList(id) {
        try {
            Toast.show({ icon: 'loading', content: '加载中…' });
            const res = await API.get('/houses', { params: {cityId: id}});
            Toast.clear();
            this.setState({
            housesList: res.data.body.list,
            // 展示房源列表
            isShowList: true
            })
        } catch (error) {
            Toast.clear();
        }
        
    }

    componentDidMount() {
        this.initMap();
    }
    render() {
        return (
            <div className={styles.map}>
                <NavHeader>地图找房</NavHeader>
                <div id="container" className={styles.container} ></div> 
                {/* <Map style={{ height: '100%' }} ref={ref => {this.map = ref.map}} center={{lng: 116.402544, lat: 39.928216}} zoom="11">
                    <Marker position={{lng: 116.402544, lat: 39.928216}} />
                    <NavigationControl /> 
                    <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/>
                </Map> */}

                <div
                className={[
                    styles.houseList,
                    this.state.isShowList ? styles.show : ''
                ].join(' ')}
                >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <Link className={styles.titleMore} to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {/* 房屋结构 */}
                        { 
                            this.state.housesList.map(item => ( 
                                <HouseItem key={item.houseCode} data={item} /> 
                            ))
                        }
                    </div>
                </div>

            </div>
        )
    }
}
