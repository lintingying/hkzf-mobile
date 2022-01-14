import React, { Component } from 'react'
import SearchHeader from '../../components/SearchHeader';
import { getCurrentCity } from '../../utils/city'
import styles from './index.module.css'
export default class HouseList extends Component {
    state = {
        curCityName: '上海', // 当前城市名
    }
    async getCurCity() {
        const res = await getCurrentCity();
        this.setState({
          curCityName: res.label
        });
    }
    componentDidMount() {
        this.getCurCity()
    }
    render() {
        return (
            <div className="houselist">
                <SearchHeader showBack={true} cityName={this.state.curCityName} className={styles.search}></SearchHeader>
            </div>
        )
    }
}

