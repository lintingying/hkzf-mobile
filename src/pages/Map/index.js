import React, { Component } from 'react'
// import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmapgl';
import NavHeader from '../../components/NavHeader';
import axios from 'axios';
import './index.scss';
import { Toast } from 'antd-mobile';

const BMapGL = window.BMapGL;

export default class MyMap extends Component {
    map;
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
    }
    
    async renderOverlays(id) {
        Toast.show({ icon: 'loading', content: '加载中…' });
        const res = await axios.get('http://localhost:8080/area/map', { params: {id: id}});
        Toast.clear();
        // 创建覆盖物
        res.data.body.forEach(item => {
            this.createOverlays(item)
        });
    }

    createOverlays(item) {
        const { coord: { latitude, longitude }, count, label: areaName, value  } = item;
        const areaOpint = new BMapGL.Point(longitude, latitude);
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
        label.id = value;
        // 添加单击事件
        label.addEventListener('click', () => {
            // 放大地图，作为中心
            this.map.centerAndZoom(areaOpint, 11);
            this.map.clearOverlays()

        })
        // 将覆盖物添加到地图
        this.map.addOverlay(label);
    }


    componentDidMount() {
        this.initMap();
    }
    render() {
        return (
            <div className="mymap">
                <NavHeader>地图找房</NavHeader>
                <div id="container"></div> 
                {/* <Map style={{ height: '100%' }} ref={ref => {this.map = ref.map}} center={{lng: 116.402544, lat: 39.928216}} zoom="11">
                    <Marker position={{lng: 116.402544, lat: 39.928216}} />
                    <NavigationControl /> 
                    <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/>
                </Map> */}
            </div>
        )
    }
}
