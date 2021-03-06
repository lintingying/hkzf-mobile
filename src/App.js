import React from 'react'
import { useRoutes, Navigate } from 'react-router-dom'
// import {BrowserRouter as Router, Route, Link, Routes, useRoutes} from 'react-router-dom'
import Home from './pages/Home'
// import HouseList from './pages/HouseList'
// import News from './pages/News'
// import Index from './pages/Index'
// import User from './pages/User'
// import CityList from './pages/CityList'
// import MyMap from './pages/Map'
// import Login from './pages/Login'
// import HouseDetail from './pages/HouseDetail'
// import Register from './pages/register'
// import Favourite from './pages/Favourite'
// import AuthRoute from './components/AuthRoute'

// 使用动态组件的方式导入组件：
// const Home = React.lazy(() => import('./pages/Home'))
const HouseList = React.lazy(() => import('./pages/HouseList'))
const News = React.lazy(() => import('./pages/News'))
const Index = React.lazy(() => import('./pages/Index'))
const User = React.lazy(() => import('./pages/User'))
const CityList = React.lazy(() => import('./pages/CityList'))
const MyMap = React.lazy(() => import('./pages/Map'))
const Login = React.lazy(() => import('./pages/Login'))
const HouseDetail = React.lazy(() => import('./pages/HouseDetail'))
const Register = React.lazy(() => import('./pages/Register'))
const Favourite = React.lazy(() => import('./pages/Favourite'))
const AuthRoute = React.lazy(() => import('./components/AuthRoute'))

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
    { path: 'favourite', element: <AuthRoute><Favourite /></AuthRoute> },
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
