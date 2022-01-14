import React, { Component } from 'react'
import { Swiper, Grid,List,Image,Space } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
import './index.scss'
import { getCurrentCity } from '../../utils/city'
import { BASE_URL } from '../../utils/url'
import { API } from '../../utils/api'
export default class Index extends Component {
  state = {
    curCityName: '上海', // 当前城市名
    swipers: [], // 轮播图数据
    groups: [], // 租房小组数据
    news: [], // 最新资讯
  }
  //获取轮播图数据
  async getSwipers() {
      const res  = await API.get('/home/swiper');
      this.setState({
        swipers: res.data.body
      });
  }
  async getGroups() {
    const res = await API.get('/home/groups',{
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    });
    this.setState({
      groups: res.data.body
    });
  }
  async getNews() {
    const res = await API.get('/home/news',{
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    });
    this.setState({
      news: res.data.body
    });
  }
  // getCurCity() {
  //   // 通过百度地图获取当前城市信息
  //   const curCity = new window.BMapGL.LocalCity();
  //   curCity.get(async r => {
  //     // 通过接口判断数据库中是否有当前城市的房源信息，如没有则返回 上海
  //     const res = await API.get('/area/info',{
  //       params: {
  //         name: r.name
  //       }
  //     });
  //     this.setState({
  //       curCityName: res.data.body.label
  //     });
  //   })
  // }
  async getCurCity() {
    const res = await getCurrentCity();
    this.setState({
      curCityName: res.label
    });
  }
  // 渲染轮播图
  renderSwipers() {
      return this.state.swipers.map(item => (
          <Swiper.Item key={item.id}>
            <img src={BASE_URL + item.imgSrc} alt={item.alt}
              style={{ width: '100%', verticalAlign: 'top' }}/>
          </Swiper.Item>
        ))
  }
  // 渲染导航栏
  renderNav() {
    const navs = [
        {
            id: 1,
            img: Nav1,
            title: '整租',
            path: '/home/list'
          },
          {
            id: 2,
            img: Nav2,
            title: '合租',
            path: '/home/list'
          },
          {
            id: 3,
            img: Nav3,
            title: '地图找房',
            path: '/map'
          },
          {
            id: 4,
            img: Nav4,
            title: '去出租',
            path: '/rent/add'
          }
    ]
    return navs.map(item => (
      <Grid.Item key={item.id}>
        <img src={item.img} alt="" />
        <div>{item.title}</div>
      </Grid.Item>
    ))
  }
  // 渲染租房小组
  renderGroups() {
    return this.state.groups.map(item => (
      <Grid.Item key={item.id}>
        <div className="group-item">
          <div>
            <h3>{item.title}</h3>
            <div>{item.desc}</div>
          </div>
          <img src={BASE_URL + item.imgSrc} alt="" />
        </div>
      </Grid.Item>
    ))
  }
  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <List.Item key={item.id} prefix={<Image src={BASE_URL + item.imgSrc} fit='cover' width={80} height={80}/>} >
        <div>{item.title}</div>
        <div className="info">
          <span>{item.from}</span>
          <span>{item.date}</span>
        </div>
      </List.Item>
    ))
  }

  componentDidMount() {
    this.getSwipers();
    this.getGroups();
    this.getNews();
    this.getCurCity()
  }
  
  render() {
    return (
      <div className="index">
        <div className="swiper">
          <Swiper autoplay>
            {this.renderSwipers()}
          </Swiper>
          <SearchHeader cityName={this.state.curCityName}></SearchHeader>
        </div>

        <Grid columns={4} gap={8} className="nav">
          {this.renderNav()}
        </Grid>

        <Space direction='vertical'></Space>

        <div className="group">
          <h2>租房小组<span className="more">更多</span></h2>
          <Grid columns={2} gap={8}>
            {this.renderGroups()}
          </Grid>
        </div>

        <Space direction='vertical'></Space>
        
        <div className="news">
          <h2>最新资讯<span className="more">更多</span></h2>
            <List>
              {this.renderNews()}
            </List>
        </div>
      </div>
    )
  }
}
