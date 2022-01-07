克隆仓库
git clone git@github.com:lintingying/hkzf-mobile.git

重置全局npm源，修正为 淘宝的 NPM 镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org

安装 Yarn
cnpm i -g yarn
更新yarn配置
yarn config set registry https://registry.npm.taobao.org


npx create-react-app hkzf-mobile  创建项目

yarn add antd-mobile@next   添加antd-mobile

yarn add react-router-dom   添加路由

yarn add node-sass 添加sass样式文件
node-sass的下载在国内是个老大难的问题，如果你不翻墙，默认下载极大可能会失败。怎么办呢？ 配置下 node-sass 的二进制包镜像地址就行了
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g

yarn add prop-types 添加组件校验

组件样式覆盖
创建名为 [name].module.css 的样式文件（react脚手架中的约定，react会处理为css module)
推荐单个类名，不要嵌套，使用驼峰命名