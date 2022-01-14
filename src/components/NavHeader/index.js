import React from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import './index.scss'
import PropTypes from 'prop-types'
import './index.module.css'
/**
 * navigate(-1) 返回上一页
 */
export default function NavHeader({children}) {
    const navigate = useNavigate()
    return (
        <NavBar onBack={() => navigate(-1)}>{children}</NavBar>
    )
}
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
}