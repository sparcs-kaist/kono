import React from 'react';
import styles from 'styles/components/Spinner.module.scss';

export default ({ size = 64 }) => {

    return (
        <div className={styles.Spinner}
            style={{ width: size, height: size }}>
            <div></div><div></div><div></div><div></div>
        </div>
    )

}