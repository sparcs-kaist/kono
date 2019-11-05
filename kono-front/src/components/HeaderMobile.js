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
                        styles.HeaderMobile__common_menu
                    ])}
                    onClick={onToggleDropdown}
                >
                    <MaterialIcon>
                        {
                            dropdown ? 'clear' : 'dehaze'
                        }
                    </MaterialIcon>
                </div>
            </div>
            <div className={styles.HeaderMobile__dropdown}>
                <div className={styles.HeaderMobile__dropdown_group}>
                    <div className={styles.HeaderMobile__dropdown_item}>
                        <a href="https://docs.google.com/forms/d/1Wb33uCYDl4kAyg-_5lZ6n20ByJ-NhelUDOz_8_U5Y6w/edit">
                            { text.refund }
                        </a>
                    </div>
                    <div className={styles.HeaderMobile__dropdown_item}>
                        <Link to="/credit">
                            { text.credit }
                        </Link>
                    </div>
                    <div className={styles.HeaderMobile__dropdown_item}>
                        <a href="https://mit-license.org">
                            { text.license }
                        </a>
                    </div>
                </div>
                <div className={styles.HeaderMobile__dropdown_group}>
                    <div 
                        className={styles.HeaderMobile__dropdown_item}
                        onClick={onToggleTheme}
                    >
                        <MaterialIcon style={{ padding: '0 5px' }}>brightness_4</MaterialIcon>
                        <div>{ text.toggle_theme }</div>
                    </div>
                    <div 
                        className={styles.HeaderMobile__dropdown_item}
                        onClick={onToggleLanguage}
                    >
                        <MaterialIcon style={{ padding: '0 5px' }}>language</MaterialIcon>
                        <div>{ text.toggle_language }</div>
                    </div>
                </div>
                <div className={styles.HeaderMobile__dropdown_group}>
                    {
                        !login && <div className={styles.HeaderMobile__dropdown_item}>
                            <Link to="/login">
                                { text.admin_login }
                            </Link>
                        </div>
                    }
                    {
                        login && (
                            <>
                                <div className={styles.HeaderMobile__dropdown_item}>
                                    { text.admin_menu }
                                </div>
                                <div className={styles.HeaderMobile__dropdown_item} onClick={onLogout}>
                                    { text.admin_logout }
                                </div>
                            </>
                        )
                    }
                    <div className={styles.HeaderMobile__dropdown_item}>
                        <a href="https://forms.gle/daJLFiyjygWuqM5j9">
                            { text.contact }
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}