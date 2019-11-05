import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HeaderMobile.module.scss';
import classnames from '../lib/classnames';
import { ReactComponent as Logo } from '../res/icons/logo.svg';
import MaterialIcon from './MaterialIcon';

export default ({
    text, login, 
    onToggleTheme, onToggleLanguage, onLogout
}) => {

    const [dropdown, setDropdown] = useState(false);
    const onToggleDropdown = () => { setDropdown(e => !e); }

    return (
        <div className={styles.HeaderMobile}>
            <div className={styles.HeaderMobile__bar} />
            <div className={styles.HeaderMobile__content}>
                <div className={styles.HeaderMobile__logo}>
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>
                <div 
                    className={classnames([
                        styles.HeaderMobile__common_menu,
                        dropdown && styles.HeaderMobile__menu_pressed
                    ])}
                    onClick={onToggleDropdown}
                >
                    <MaterialIcon md36>dehaze</MaterialIcon>
                </div>
            </div>
        </div>
    )
}