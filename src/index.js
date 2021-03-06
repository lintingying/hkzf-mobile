import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom'

// 可视区域渲染样式文件
import 'react-virtualized/styles.css';

// 导入字体图标库的样式文件
import './assets/fonts/iconfont.css'

/**
 * 项目入口文件(渲染根组件,导入组件库等)
 */
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Suspense fallback={<div className="route-loading">loading...</div>}>
        <App />
      </Suspense>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
