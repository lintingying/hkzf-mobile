import React, { Component } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'

// 导入组件自己的样式文件
import './index.css'

const Bottom = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = value => {
    navigate(value)
  }

  const tabs = [
    {
      key: '/home/index',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/home/list',
      title: '找房',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/home/news',
      title: '资讯',
      icon: <MessageOutline />,
    },
    {
      key: '/home/user',
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  return (
    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}

export default class Home extends Component {
  render() {
      return (
        <div className='home'>
          <Outlet></Outlet>
          <Bottom></Bottom>
        </div> 
      )
  }
}
