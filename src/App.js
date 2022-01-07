import React from 'react'
import {useRoutes, Navigate} from 'react-router-dom'
// import {BrowserRouter as Router, Route, Link, Routes, useRoutes} from 'react-router-dom'
import Home from './pages/Home'
import HouseList from './pages/HouseList'
import News from './pages/News'
import Index from './pages/Index'
import User from './pages/User'
import CityList from './pages/CityList'
import MyMap from './pages/Map'
// 只要导入了组件，不管组件有没有显示在页面中，组建的样式就生效--引起样式覆盖
// 1 起不同的类名
// 2 css in js：用js编写css  cssModules styled-components等
// 推荐使用css modules----react脚手架已集成
/**
 * 根组件-配置路由信息
 */
function App() {
   const routes = useRoutes([
    { path: '', element: <Navigate to="home" /> },
    { 
      path: 'home', 
      element: <Home />,
      children: [
        { path: '', element: <Navigate to="index" />  },
        { path: 'index', element: <Index /> },
        { path: 'list', element: <HouseList /> },
        { path: 'news', element: <News /> },
        { path: 'user', element: <User /> },
      ]
    },
    { path: 'cityList', element: <CityList /> },
    { path: 'map', element: <MyMap /> },
    // { path: '*', element: <NotFound />}
  ]);
  return routes;
 
  // return (
  //   <Router>
  //     <div className="App">
  //       <div>app</div>
  //       <ul>
  //         <li><Link to="/home">首页</Link></li>
  //         <li><Link to="/citylist">城市选择</Link></li>
  //       </ul>
  //       <Routes>
  //         <Route path="/home" element={<Home />}>
  //           <Route path="news" element={<News />}></Route>
  //         </Route>
  //         <Route path="/citylist" element={<CityList />}></Route>
  //       </Routes>
  //   </div>
  //   </Router>
  // );
}

export default App;
