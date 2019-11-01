import React from 'react';
import styles from '../styles/RoomDiscoBall.module.scss';
import classnames from '../lib/classnames';

export default ({ x = 0, y = 0 }) => {
  return (
    <div className={styles.discoBall}>
      <div
        className={styles.view}
        style={{
          top: y,
          left: x
        }}
      >
        <div className={classnames([
          styles.plane,
          styles.main
          ])}
        >
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>
      </div>
    </div>
  );
}