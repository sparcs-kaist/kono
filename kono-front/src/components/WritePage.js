import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../styles/WritePage.module.scss';
import NavPanel from './NavPanel';
import MaterialIcon from './MaterialIcon';

export default () => {

    const login = useSelector(state => state.auth.login, []);

    if (login === 'rejected')
        return (<Redirect to="/login?state=forbidden&prev=write" />);

    return (
        <div className={styles.WritePage}>
            <NavPanel 
                menus={[
                    (<div key='write'>작성하기</div>), 
                    (<div key='preview'>미리보기</div>)
                ]}
                contents={[
                    (
                        <div></div>
                    ),
                    (
                        <div></div>
                    )
                ]}
            />
            <div className={styles.WritePage__footer}>
                <div className={styles.WritePage__button}>
                    <MaterialIcon large>add_photo_alternate</MaterialIcon>
                </div>
                <div className={styles.WritePage__button}>
                    <MaterialIcon large>check</MaterialIcon>
                </div>
            </div>
        </div>
    );

}