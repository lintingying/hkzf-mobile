import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'
import styles from './index.module.css';
import { Form, Input, Button, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { API } from '../../utils/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    /**
     * 提交表单且数据验证成功后触发
     */
    const onFinish = async () => {
        // 发送请求
        const res = await API.post('/user/login', {
            username,
            password
        })

        const { status, body, description } = res.data

        if (status === 200) {
            // 登录成功
            localStorage.setItem('hkzf_token', body.token)
            navigate(-1)
        } else {
            // 登录失败
            Toast.show({
                icon: 'fail',
                content: description,
            })
        }
    }

    return (
        <div className={styles.login}>
            <NavHeader>登录</NavHeader>
            <Form onFinish={onFinish} footer={
                <Button block type='submit' color='primary' size='large'>
                    登录
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
                <Link to='/register'>还没有账号？去注册</Link>
            </div>
        </div>
    )

}
