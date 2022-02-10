import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Modal } from 'antd-mobile'

import { BASE_URL } from '../../utils/url'
import { API } from '../../utils/api'
import { removeToken, isAuth } from '../../utils/auth'

import styles from './index.module.css'

// 菜单数据
const menus = [
    { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
    { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
    { id: 3, name: '看房记录', iconfont: 'icon-record' },
    { id: 4, name: '成为房主', iconfont: 'icon-identity' },
    { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
    { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = '/img/profile/avatar.png'
export default class User extends Component {
    state = {
        isLogin: isAuth(),
        userInfo: {
            avatar: '',
            nickname: ''
        }
    }
    // 注意：不要忘了在进入页面时调用方法 ！
    componentDidMount() {
        this.getUserInfo()
    }

    // 退出
    logout = () => {
        Modal.confirm({
            content: '是否确定退出',
            onConfirm: async () => {
                // 调用退出接口
                await API.post('/user/logout')

                // 移除本地token
                removeToken()

                // 处理状态
                this.setState({
                    isLogin: false,
                    userInfo: {
                        avatar: '',
                        nickname: ''
                    }
                })
            },
        })
    }

    async getUserInfo() {
        if (!this.state.isLogin) {
            // 未登录
            return
        }

        // 发送请求，获取个人资料
        const res = await API.get('/user')

        // console.log(res)
        if (res.data.status === 200) {
            const { avatar, nickname } = res.data.body
            this.setState({
                userInfo: {
                    avatar,
                    nickname
                }
            })
        } else {
            // token 失效的情况，这种情况下， 应该将 isLogin 设置为 false
            this.setState({
                isLogin: false
            })
        }
    }

    render() {
        const { isLogin, userInfo: { avatar, nickname } } = this.state
        return (
            <div className={styles.root}>
                {/* 个人信息 */}
                <div className={styles.title}>
                    <img className={styles.bg} src={BASE_URL + '/img/profile/bg.png'} alt="背景图" />
                    <div className={styles.info}>
                        <div className={styles.myIcon}>
                            <img className={styles.avatar} src={BASE_URL + (avatar || DEFAULT_AVATAR)} alt="icon" />
                        </div>
                        <div className={styles.user}>
                            <div className={styles.name}>{nickname || '游客'}</div>
                            {/* 登录后展示： */}
                            {isLogin ? (
                                <>
                                    <div className={styles.auth}>
                                        <span onClick={this.logout}>退出</span>
                                    </div>
                                    <div className={styles.edit}>
                                        编辑个人资料
                                        <span className={styles.arrow}>
                                            <i className="iconfont icon-arrow" />
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.edit}>
                                    <Link to="/login"><Button color='primary'>去登录</Button></Link>
                                </div>
                            )}

                            {/* 未登录展示： */}
                        </div>
                    </div>
                </div>

                {/* 九宫格菜单 */}
                <div className={styles.menus}>
                    <Grid columns={3} gap={16}>
                        {menus.map(item => (
                            <Grid.Item key={item.id}>
                                {item.to ? (
                                    <Link to={item.to}>
                                        <div className={styles.menuItem}>
                                            <i className={`iconfont ${item.iconfont}`} />
                                            <span>{item.name}</span>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className={styles.menuItem}>
                                        <i className={`iconfont ${item.iconfont}`} />
                                        <span>{item.name}</span>
                                    </div>
                                )}
                            </Grid.Item>
                        ))}
                    </Grid>
                </div>


                {/* 加入我们 */}
                <div className={styles.ad}>
                    <img src={BASE_URL + '/img/profile/join.png'} alt="" />
                </div>
            </div>
        )
    }
}
