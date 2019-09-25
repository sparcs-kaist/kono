import React from 'react';
import { useSelector } from 'react-redux';
import style from '../styles/PostPage.module.scss';
import StaticContent from './StaticContent';
import MaterialIcon from './MaterialIcon';
import PostHeader from './PostHeader';

function getTypeString(type, language) {
    switch (language) {
        case 'kr':
            switch (type) {
                case 'notice':
                    return '공지사항';
                case 'lostfound':
                    return '분실물';
                default:
                    return '게시물';
            }
        case 'en':
            switch (type) {
                case 'notice':
                    return 'Notice';
                case 'lostfound':
                    return 'Lost & Found';
                default:
                    return 'Post';
            }
    }
}

function getDateString(date, language) {
    return date.toLocaleString('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

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
        type: 'notice',
        title_kr: '태풍 및 카포전으로 인한 임시 휴무 안내',
        title_en: 'Notice for temporal Coin Karaoke closing due to typhoon & POSTECH-KAIST Science war',
        date: new Date('2019-09-05T00:00:00'),
        content_kr: '/posts/example_kr.html',
        content_en: '/posts/example_en.html',
        content_img: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/440px-React-icon.svg.png',
            'https://avatars0.githubusercontent.com/u/25701854?s=460&v=4',
            'https://avatars3.githubusercontent.com/u/5449435?s=200&v=4'
        ]
    };

    const post = __temp_post;

    const language = useSelector(state => state.config.language, []);

    const header = {
        type : getTypeString(post.type, language),
        title: post[`title_${language}`],
        date : getDateString(post.date, language)
    };
    const textContentURL = post[`content_${language}`];
    const imgContentURLs = post.content_img;

    return (
        <div className={style.PostPage}>
            <PostHeader header={header} />
            <div className={style.PostPage__content}>
                <StaticContent url={textContentURL} />
            </div>
            <a href="/">
                <MaterialIcon>arrow_back</MaterialIcon>
            </a>
        </div>
    );

}