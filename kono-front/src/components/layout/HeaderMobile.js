import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from 'styles/HeaderMobile.module.scss';
import classnames from 'lib/classnames';
import { ReactComponent as Logo } from 'res/icons/logo.svg';
import { MaterialIcon } from 'components/common';
import * as LayoutActions from 'store/modules/layout';

export default ({
    text, login, 
    onToggleTheme, onToggleLanguage, onLogout
}) => {

    const dispatch = useDispatch();
    const open = useSelector(store => store.layout.headerOpen);
    const onToggleOpen = () => { dispatch(LayoutActions.ToggleMobileHeader()); };
    const onClickLink  = () => { dispatch(LayoutActions.CloseMobileHeader());  };

    return (
        <div className={styles.HeaderMobile}>
            <div className={styles.HeaderMobile__bar} />
            <div className={styles.HeaderMobile__content}>
                <div className={styles.HeaderMobile__logo}>
                    <Link onClick={onClickLink} to="/">
                        <Logo />
                    </Link>
                </div>
                <div 
                    className={styles.HeaderMobile__common_menu}
                    onClick={onToggleOpen}
                >
                    <MaterialIcon>
                        {
                            open ? 'clear' : 'dehaze'
                        }
                    </MaterialIcon>
                </div>
            </div>
            <div 
                className={classnames([
                    styles.HeaderMobile__dropdown,
                    open && styles.HeaderMobile__dropdown_open
                ])}
            >
                <div className={styles.HeaderMobile__dropdown_content}>
                    <div className={styles.HeaderMobile__dropdown_group}>
                        <div className={styles.HeaderMobile__dropdown_item}>
                            <a href="https://docs.google.com/forms/d/1Wb33uCYDl4kAyg-_5lZ6n20ByJ-NhelUDOz_8_U5Y6w/edit">
                                { text.refund }
                            </a>
                        </div>
                        <div className={styles.HeaderMobile__dropdown_item}>
                            <Link onClick={onClickLink} to="/credit">
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
                                <Link onClick={onClickLink} to="/login">
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
                                    <div 
                                        className={styles.HeaderMobile__dropdown_item} 
                                        onClick={() => { onLogout(); onClickLink(); }}
                                    >
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
        </div>
    )
}