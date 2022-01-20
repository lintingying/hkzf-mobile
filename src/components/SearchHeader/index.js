import { SearchBar } from 'antd-mobile'
import { DownOutline, EnvironmentOutline, LeftOutline } from 'antd-mobile-icons'
import { Link } from 'react-router-dom'
import styles from './index.module.css'
import PropTypes from 'prop-types';

export default function SearchHeader({ showBack, cityName, className }) {
    return (
        <div className={[styles.searchHeader, className || ''].join(' ')}>
            {showBack && <Link className={styles.back} to={-1}><LeftOutline /></Link>}
            <Link className={styles.city} to="/cityList">{cityName} <DownOutline /></Link>
            <SearchBar placeholder='请输入小区或地址' style={{
                '--border-radius': '0px',
                '--background': '#ffffff',
            }} />
            <Link className={styles.map} to="/map"><EnvironmentOutline /></Link>
        </div>
    );
}

SearchHeader.propTypes = {
    showBack: PropTypes.bool = false,
    cityName: PropTypes.string.isRequired,
    className: PropTypes.string
}