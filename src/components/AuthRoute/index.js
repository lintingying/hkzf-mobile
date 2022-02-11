import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuth } from '../../utils/auth'

/* 
  封装 AuthRoute 鉴权路由组件：

  1 在 components 目录中创建 AuthRoute/index.js 文件。
  2 创建组件 AuthRoute 并导出。
  3 调用 isAuth() 判断是否登录。
  4 如果登录了，就渲染当前组件（通过参数 children 获取到要渲染的组件）。
  5 如果没有登录，就重定向到登录页面
*/

// <AuthRoute path="..." component={...}></AuthRoute>
const AuthRoute = ({ children }) => {
  const isLogin = isAuth()
  return isLogin ? (children) : (<Navigate to="/login" />)
}

export default AuthRoute
