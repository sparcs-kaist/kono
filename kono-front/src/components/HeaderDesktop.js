import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../res/icons/logo.svg';
import MaterialIcon from './MaterialIcon';
import styles from '../styles/HeaderDesktop.module.scss';

export default ({ 
    text, login, 
    onToggleTheme, onToggleLanguage, onLogout
}) => {
    return (
        <div className={styles.HeaderDesktop}>
            <div className={styles.HeaderDesktop__bar}></div>
            <div className={styles.HeaderDesktop__content}>
                <span className={styles.HeaderDesktop__logo}>
                    <Link to="/">
                        <Logo />
                    </Link>
                </span>
                <span className={styles.HeaderDesktop__menu}>
                    <a href="https://docs.google.com/forms/d/1Wb33uCYDl4kAyg-_5lZ6n20ByJ-NhelUDOz_8_U5Y6w/edit">
                        { text.refund }
                    </a>
                </span>
                <span 
                    className={styles.HeaderDesktop__common_menu}
                    onClick={onToggleTheme}
                >
                    <MaterialIcon style={{ padding: '0 5px' }}>brightness_4</MaterialIcon>
                    <div>{ text.toggle_theme }</div>
                </span>
                <div 
                    className={styles.HeaderDesktop__common_menu}
                    onClick={onToggleLanguage}
                >
                    <MaterialIcon style={{ padding: '0 5px' }}>language</MaterialIcon>
                    <div>{ text.toggle_language }</div>
                </div>
                {
                    login && (
                        <>
                            <span className={styles.HeaderDesktop__common_menu}>
                                { text.admin_menu }
                            </span>
                            <span className={styles.HeaderDesktop__common_menu} onClick={onLogout}>
                                { text.admin_logout }
                            </span>
                        </>
                    )
                }
            </div>
            
        </div>
    );
}