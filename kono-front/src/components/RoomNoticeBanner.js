import React from 'react';
import styles from '../styles/RoomNoticeBanner.module.scss';
import MaterialIcon from './MaterialIcon';

export default ({ notices }) => {

    return (
        <div className={styles.RoomNoticeBanner}>
            {
                notices.map((notice, idx) => (
                    <div 
                        className={styles.RoomNoticeBanner__single}
                        key={`room-notice-${idx}`}
                    >
                        <MaterialIcon md15>info</MaterialIcon>
                        <span>{ notice }</span>
                    </div>
                ))
            }
        </div>
    )

}