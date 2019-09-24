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
                menus={[(
                    <div key='write'>
                        작성하기
                    </div>
                ), (
                    <div key='preview'>
                        미리보기
                    </div>
                )]}
                contents={[(
                    <div>Tab 1</div>
                ), (
                    <div>Tab 2</div>
                )]}
            />
            <div className={styles.WritePage__footer}>
                <div className={styles.WritePage__button}>
                    업로드
                </div>
            </div>
        </div>
    );

}