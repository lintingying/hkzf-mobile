import React, { Component } from 'react';
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css';
import {
    Form,
    Input,
    Button,
} from 'antd-mobile'

export default class Login extends Component {
    state = {
        userName: '',
        password: ''
    }
    onFinish = () => {

    }
    setValue = () => {

    }
    render() {
        const { userName, password } = this.state
        return (
            <div className={styles.login}>
                <NavHeader>登录</NavHeader>
                <Form onFinish={this.onFinish} footer={
                    <Button block type='submit' color='primary' size='large'>
                        登录
                    </Button>
                }>
                    <Form.Item name='用户名' label='用户名' rules={[{ required: true, message: '不能为空' }]}>
                        <Input placeholder='请输入用户名' value={userName} onChange={val => this.setValue(val)} />
                    </Form.Item>
                    <Form.Item name='密码' label='密码' rules={[{ required: true, message: '不能为空' }]}>
                        <Input placeholder='请输入密码' value={password} onChange={val => this.setValue(val)} />
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
