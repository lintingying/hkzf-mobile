import React from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import './index.scss'
import PropTypes from 'prop-types'
import './index.module.css'

export default function NavHeader({children}) {
    const navigate = useNavigate()
    return (
        <NavBar onBack={() => navigate('/home/index')}>{children}</NavBar>
    )
}
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    // onBack: PropTypes.func
}