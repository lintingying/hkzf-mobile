import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.css'
import { BASE_URL } from '../../utils/url'

export default function HouseItem({ data }) {
    const navigate = useNavigate()
    const { houseImg, title, desc, tags, price, houseCode, style } = data;
    return (
        <div className={styles.house} onClick={() => navigate(`/detail/${houseCode}`)} style={style}>
            <div className={styles.imgWrap}>
                <img className={styles.img} src={BASE_URL + houseImg} alt="" />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.desc}>{desc}</div>
                <div>
                    {/* ['近地铁', '随时看房'] */}
                    {tags.map((tag, index) => {
                        const tagClass = 'tag' + (index + 1)
                        return (
                            <span className={[styles.tag, styles[tagClass]].join(' ')} key={tag}>
                                {tag}
                            </span>
                        )
                    })}
                </div>
                <div className={styles.price}>
                    <span className={styles.priceNum}>{price}</span> 元/月
                </div>
            </div>
        </div>
    )
}