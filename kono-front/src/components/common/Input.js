import React from 'react';
import styles from 'styles/Input.module.scss';

export default ({ setValue, ...rest }) => {

    const onChange = (e) => {
        if (setValue)
            setValue(e.target.value);
    }

    return (
        <input type="text"
            onChange={onChange}
            className={styles.Input} 
            {...rest} />
    )

}