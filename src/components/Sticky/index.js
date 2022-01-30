import React, { Component } from 'react';
import PropTypes from 'prop-types'
import styles from './index.module.css'

export default class Sticky extends Component {
    // 创建ref对象-占位
    placeholder = React.createRef()
    content = React.createRef()

    handleScroll = () => {
        const placeholderEl = this.placeholder.current
        const contentEl = this.content.current
        const { top } = placeholderEl.getBoundingClientRect()
        if (top < 0) {
            // 吸顶
            contentEl.classList.add(styles.fixed)
            placeholderEl.style.height = this.props.height + "px"
        } else {
            // 取消吸顶
            contentEl.classList.remove(styles.fixed)
            placeholderEl.style.height = '0px'
        }
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    render() {
        return (
            <div>
                <div ref={this.placeholder}></div>
                <div ref={this.content}>{this.props.children}</div>
            </div>
        );
    }
}

Sticky.propTypes = {
    height: PropTypes.number.isRequired
}