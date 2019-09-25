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
            'https://scontent.ficn2-1.fna.fbcdn.net/v/t1.0-9/52608632_1061359487385747_1269556598569697280_n.jpg?_nc_cat=111&_nc_oc=AQkNS_wHKOCgTiD0clqwzOKsVY9O4Coi9DefIatBQHOsW5q4fMl-JC_RrWldiwAkTfg&_nc_ht=scontent.ficn2-1.fna&oh=b50a9b427cd2e7b258eade8f8f7d6756&oe=5E30540A',
            'https://scontent.ficn2-1.fna.fbcdn.net/v/t1.0-9/53160271_1061359500719079_4915475416120033280_n.jpg?_nc_cat=107&_nc_oc=AQlr5rMKm5c6936ImejpCpYJ-5-i9699gnBjMcbLCtlJQTpcl-DbhiX0kDlkHjS_iKs&_nc_ht=scontent.ficn2-1.fna&oh=7c01b7e755c4e45d247ee216a94b6168&oe=5DF0C673',
            'https://scontent.ficn2-1.fna.fbcdn.net/v/t1.0-9/52396209_1061359504052412_862880658005950464_n.jpg?_nc_cat=111&_nc_oc=AQk0DLugtk-BOIvyWE0xzx0Oygq5QLaKcBLvp2biuE3DDLESW_61DzDORqhkpVrsN1I&_nc_ht=scontent.ficn2-1.fna&oh=995ba7f3a6e31a24151f81a22d3bc1ff&oe=5E3AC96A',
            // 'https://scontent.ficn2-1.fna.fbcdn.net/v/t1.0-9/52611774_1061359550719074_4511707035271692288_n.jpg?_nc_cat=100&_nc_oc=AQnuIwBt-rmmAuoeAfyLS6HQ9DVJKgPXARM3WWmj9db2KgHuavQDn3I0NwTcG8xqBSQ&_nc_ht=scontent.ficn2-1.fna&oh=b4af0bc0cb43cdac50b45e71efbda000&oe=5E3ADEE3',
            // 'https://scontent.ficn2-1.fna.fbcdn.net/v/t1.0-9/52765506_1061359574052405_4773436896271400960_n.jpg?_nc_cat=109&_nc_oc=AQls43fPYe3u5sUEctf0MoVb8WRhxUWhDzwoA2MdfZZ-jhhKvCsJ3tobf0iKDk_WjHI&_nc_ht=scontent.ficn2-1.fna&oh=62f1453c41ce8d5d4ea2fc10fd640aa2&oe=5DF59A92',
            // 'https://scontent.ficn2-1.fna.fbcdn.net/v/t1.0-9/53046765_1061359570719072_1485591151456026624_n.jpg?_nc_cat=104&_nc_oc=AQn1JpmixwbUzi2aiUiCtpsqzRSyqDrnr9CiMDAn9uJK6L4GO-bdrvUk3B4Q9posje8&_nc_ht=scontent.ficn2-1.fna&oh=7ff5322f248f69803a6974dc1e9c8965&oe=5E371614'
        ]
    };

    const post = __temp_post;

    return (
        <PostPageView post={post} />
    );

}