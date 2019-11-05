import React from 'react';
import styles from '../styles/Footer.module.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReactComponent as SPARCSLogo } from '../res/icons/sparcs_logo.svg';
import { ReactComponent as SWCLogo } from '../res/icons/SWC_logo.svg';
import classnames from '../lib/classnames';
import Text from '../res/texts/Footer.text.json';
import useLanguages from '../lib/hooks/useLanguages';
import useWindowDimension from '../lib/hooks/useWindowDimension';

export default () => {

    const login = useSelector(state => state.auth.login, []);
    const [text] = useLanguages(Text);
    const { width } = useWindowDimension();

    const showDesktopFooter = width >= 800;

    return (
        <div 
            className={classnames([
                styles.Footer,
                showDesktopFooter && styles.Footer__desktop
            ])}
        >
            <div className={styles.Footer__logo}>
                <div className={styles.Footer__sparcs_logo}>
                    <a href="https://sparcs.org">
                        <SPARCSLogo />
                    </a>
                </div>
                <div className={styles.Footer__cross}>X</div>
                <div className={styles.Footer__swc_logo}>
                    <a href="https://welfare.kaist.ac.kr/">
                        <SWCLogo />
                    </a>
                </div>
                {
                    showDesktopFooter && <span className={styles.Footer__menu}>
                        <Link to="/credit">
                            { text.credit }
                        </Link>
                    </span>
                }
            </div>
            {
                showDesktopFooter && <>
                    <span className={styles.Footer__menu}>
                        <a href="https://mit-license.org">
                            { text.license }
                        </a>
                    </span>
                    {
                        !login && (
                            <span className={styles.Footer__common_menu}>
                                <Link to="/login">
                                    { text.admin_login }
                                </Link>
                            </span>
                        )
                    }
                    <span className={styles.Footer__common_menu}>
                        <a href="https://forms.gle/daJLFiyjygWuqM5j9">
                            { text.contact }
                        </a>
                    </span>
                </>
            }
        </div>
    )
}