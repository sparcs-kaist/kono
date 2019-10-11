import React from 'react';
import style from '../styles/Spinner.module.scss';
import classnames from '../lib/classnames';

export default ({ small, primary }) => {

    return (
        <div className={classnames([
                style.Spinner,
                small && style.Spinner__small,
                primary && style.Spinner__primary
            ])}>
            <div></div><div></div><div></div><div></div>
        </div>
    )

}