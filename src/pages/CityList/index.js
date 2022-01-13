import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import {getCurrentCity} from '../../utils/city'
import './index.scss'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import NavHeader from '../../components/NavHeader'
import { API } from '../../utils/api'

// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']


function ListItem ({listItem}) { // 解构赋值，包含children和属性等
    const navigate = useNavigate()
    const changeCity = (item) => {
        if(HOUSE_CITY.indexOf(item.label) > -1) {
            localStorage.setItem('hkzf_city', JSON.stringify(item))
            navigate('/home/index')
        } else {
            Toast.show({
                content: '该城市暂无房源数据',
                duration: 1000
            })
        }
    }
    return listItem.map(item => (
        <div className="name" key={item.value} onClick={() => changeCity(item)}>
          {item.label}
        </div>
    ))
}


const formatCityData = (list) => {
    const cityList = {};
    list.forEach(e => {
        const first = e.short.substr(0,1);
        if(cityList[first]) {
            cityList[first].push(e);
        } else {
            cityList[first] = [e];
        }
    });
    const cityIndex = Object.keys(cityList).sort()
    return { cityList, cityIndex };
}
const formatCityIndex = (letter) => {
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot': 
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

export default class CityList extends Component {
    constructor(props) {
       super(props)
       this.state =  {
        cityList: {},
        cityIndex: [],
        activeIndex: 0, // 高亮索引号
       }

       // 创建ref对象
       this.cityListComponent = React.createRef()
    }

    async getCityList() {
        const res = await API.get('/area/city',{
            params: {level: '1'}
          });
        let {cityList, cityIndex} = formatCityData(res.data.body);

        const resHot = await API.get('/area/hot');
        cityList['hot'] = resHot.data.body;
        cityIndex.unshift('hot');

        const resCur = await getCurrentCity();
        cityList['#'] = [resCur];
        cityIndex.unshift('#');
        
        this.setState({
            cityList,
            cityIndex
        }, () => {
            // 提前计算list中每一行的高度，实现精确跳转
            // 保证list中已有数据
            this.cityListComponent.current.measureAllRows()
        })
    }

    rowRenderer = ({
        key,            // 唯一值
        index,          // 索引号
        isScrolling,    // 是否在滚动中
        isVisible,      // 当前行在list中是否可见
        style,          // 每行的样式对象
      }) => {
          const {cityList, cityIndex} = this.state
          const letter = cityIndex[index]
        return (
            <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(letter)}</div>
                <ListItem listItem={cityList[letter]}></ListItem>
            </div>
        );
    }
    
    getRowHeight = ({index}) => {
        const {cityList, cityIndex} = this.state
        return  36 + cityList[cityIndex[index]].length * 50
    }
    renderCityIndex() {
        const {activeIndex, cityIndex} = this.state
        return cityIndex.map((item,index) => (
            <li key={item} className="city-index-item" onClick={() => {
                // 只能看到可见的，未滚动到的计算不准
                this.cityListComponent.current.scrollToRow(index)
            }}>
                <span className={activeIndex === index ? "index-active" : ''}>
                    {item === 'hot' ?  '热' : item.toUpperCase()}
                </span>
            </li>
        ))
    }
    // 用于获取List组件中渲染行的信息
    onRowsRendered = ({ startIndex }) => {
        // console.log('startIndex：', startIndex)
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }

    componentDidMount() {
        this.getCityList();
    }
    render() {
        return (
            <div className="citylist">
                <NavHeader>城市选择</NavHeader>
                <AutoSizer>
                    {
                        ({width,height}) => 
                        <List 
                        ref={this.cityListComponent}
                        width={width} 
                        height={height} 
                        rowCount={this.state.cityIndex.length} 
                        rowHeight={this.getRowHeight} 
                        rowRenderer={this.rowRenderer}
                        onRowsRendered={this.onRowsRendered}
                        scrollToAlignment="start"
                        ></List>
                    }
                </AutoSizer>
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}

