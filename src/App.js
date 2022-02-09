import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
// import {BrowserRouter as Router, Route, Link, Routes, useRoutes} from 'react-router-dom'
import Home from './pages/Home'
import HouseList from './pages/HouseList'
import News from './pages/News'
import Index from './pages/Index'
import User from './pages/User'
import CityList from './pages/CityList'
import MyMap from './pages/Map'
import Login from './pages/Login'
import HouseDetail from './pages/HouseDetail'
import Register from './pages/register'

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
        { path: '', element: <Navigate to="index" /> },
        { path: 'index', element: <Index /> },
        { path: 'list', element: <HouseList /> },
        { path: 'news', element: <News /> },
        { path: 'user', element: <User /> },
      ]
    },
    { path: 'detail/:id', element: <HouseDetail /> },
    { path: 'cityList', element: <CityList /> },
    { path: 'map', element: <MyMap /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
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
