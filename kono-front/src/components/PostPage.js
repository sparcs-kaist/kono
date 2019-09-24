import React from 'react';
import style from '../styles/PostPage.module.scss';
import StaticContent from './StaticContent';
import MaterialIcon from './MaterialIcon';


export default ({ match }) => {

    // const { 'post_id': postId } = match.params;
    
    /* Retrieve post via API
     * TODO: improve this by caching
     */
    // const post = ...
    /*
     * post: {
     *  id: number,
     *  type: string ('notice' | 'lostfound'),
     *  title: string,
            <StaticContent url={contentURL} />
     *  date: Date,
     *  content_kr: URL (relative path from public/ directory)
     * } 
     */

    /* For now, just use temporary post */
    const __temp_post = {
        id: 1,
        type: 'notice',
        title: '태풍 및 카포전으로 인한 임시 휴무 안내',
        date: new Date('2019-09-05T00:00:00'),
        content_kr: '/posts/example.html'
    };
    const { type, title, date, content_kr: contentURL } = __temp_post;

    return (
        <div className={style.PostPage}>
            <div className={style.PostPage__header}>
                <h1>{ title }</h1>
                <div className={style.PostPage__tags}>
                    <span><b>
                        {
                            ((type) => {
                                switch (type) {
                                    case 'notice':
                                        return '공지사항';
                                    case 'lostfound':
                                        return '분실물';
                                    default:
                                        return '게시물';
                                }
                            })(type)
                        }
                    </b></span>
                    <span>
                        {
                            date.toLocaleString('default', {
                                year:  'numeric',
                                month: '2-digit',
                                day:   '2-digit'
                            })
                        }
                    </span>
                </div>
            </div>
            <div className={style.PostPage__content}>
                <StaticContent url={contentURL} />
            </div>
            <a href="/">
                <MaterialIcon>arrow_back</MaterialIcon>
            </a>
        </div>
    );

}