import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'
import styles from './index.module.css';
import { Form, Input, Button, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { API } from '../../utils/api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    /**
     * 提交表单且数据验证成功后触发
     */
    const onFinish = async () => {
        // 发送请求
        const res = await API.post('/user/registered', {
            username,
            password
        })

        const { status, body, description } = res.data

        if (status === 200) {
            // 注册成功
            localStorage.setItem('hkzf_token', body.toke) // 后端接口返回的数据 token写错
            navigate('/home')
        } else {
            // 注册失败
            Toast.show({
                icon: 'fail',
                content: description,
            })
        }
    }

    return (
        <div className={styles.register}>
            <NavHeader>注册</NavHeader>
            <Form onFinish={onFinish} footer={
                <Button block type='submit' color='primary' size='large'>
                    注册
                </Button>
            }>
                <Form.Item name='用户名' label='用户名' rules={[{ required: true, message: '不能为空' }]}>
                    <Input placeholder='请输入用户名' value={username} onChange={val => setUsername(val)} />
                </Form.Item>
                <Form.Item name='密码' label='密码' rules={[{ required: true, message: '不能为空' }]}>
                    <Input type="password" placeholder='请输入密码' value={password} onChange={val => setPassword(val)} />
                </Form.Item>
            </Form>
            <div className={styles.backHome}>
                <div><Link to="/home">点我回首页</Link></div>
                <div><Link to="/login">已有账号，去登录</Link></div>
            </div>
        </div>
    )

}
