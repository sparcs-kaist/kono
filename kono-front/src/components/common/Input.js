import React from 'react';
import styles from 'styles/Input.module.scss';

export default ({ placeholder, setValue }) => {

    const onChange = (e) => {
        if (setValue)
            setValue(e.target.value);
    }

    return (
        <input type="text" placeholder={placeholder} 
            onChange={onChange}
            className={styles.Input} />
    )

}