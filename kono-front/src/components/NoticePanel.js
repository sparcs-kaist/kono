import React from 'react';
import styles from '../styles/NoticePanel.module.scss';
import { Link } from 'react-router-dom';
import PanelHeader from './PanelHeader';
import PanelFooter from './PanelFooter';
import Text from '../res/texts/NoticePanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';

export default ({ posts }) => {

    const text = useLanguages(Text);

    return (
        <div className={styles.NoticePanel}>
            <PanelHeader title={text.title} link="/notice"/>
            <ul>
                {
                    posts.map(post => (
                        <li key={`notice-${post.id}`}>
                            <div className={styles.NoticePanel__item}>
                                <span className={styles.NoticePanel__item_title}>
                                    <Link to={`/post/${post.id}`}>
                                        { post.title.length > 24 ? `${post.title.substring(0, 24)}...` : post.title }
                                    </Link>
                                </span>
                                <span className={styles.NoticePanel__item_date}>
                                    { 
                                        post.date.toLocaleString('default', {
                                            year:  'numeric',
                                            month: '2-digit',
                                            day:   '2-digit'
                                        })
                                    }
                                </span>
                            </div>
                        </li>
                    ))
                }
            </ul>
            <PanelFooter currentPage={1} pagination={5} lastPage={3} onClickPage={(x)=>console.log(x)}/>
        </div>
    );
}