import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../styles/WritePage.module.scss';
import NavPanel from './NavPanel';

export default () => {

    const login = useSelector(state => state.auth.login, []);

    if (login === 'rejected')
        return (<Redirect to="/login?state=forbidden&prev=write" />);

    return (
        <div className={styles.WritePage}>
            <NavPanel 
                menus={[]}
                contents={[]}
            />
        </div>
    );

}