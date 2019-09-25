import React from 'react';
import PostPageView from './PostPageView';

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

    return (
        <PostPageView post={post} />
    );

}