import React from 'react';
import style from '../styles/PostPage.module.scss';
import StaticContent from './StaticContent';
import MaterialIcon from './MaterialIcon';
import PostHeader from './PostHeader';

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
    const __temp_header = {
        type: 'notice',
        title: '태풍 및 카포전으로 인한 임시 휴무 안내',
        date: new Date('2019-09-05T00:00:00')
    };
    const __temp_content_kr = '/posts/example.html';

    const header = __temp_header;
    const contentKR = __temp_content_kr;

    return (
        <div className={style.PostPage}>
            <PostHeader header={header} />
            <div className={style.PostPage__content}>
                <StaticContent url={contentKR} />
            </div>
            <a href="/">
                <MaterialIcon>arrow_back</MaterialIcon>
            </a>
        </div>
    );

}