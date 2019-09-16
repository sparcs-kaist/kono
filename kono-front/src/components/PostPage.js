import React from 'react';
import style from '../styles/PostPage.module.scss';

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
     *  date: Date,
     *  content: string // Should improve this to support document styling and images
     * } 
     */

    /* For now, just use temporary post */
    const __temp_post = {
        id: 1,
        type: 'notice',
        title: '태풍 및 카포전으로 인한 임시 휴무 안내',
        date: new Date('2019-09-05T00:00:00'),
        content: '안녕하세요, 카이스트 코인노래방입니다!\n'
            + '두 번의 코인노래방 임시 휴무 소식을 들고 오게 되었습니다\n'
            + '\n'
            + '1. 9/6(금) 오후 4시부터 9/8(일) 오후 6시까지 태풍으로 인하여 시설 보호 및 안전 문제로 인해 임시로 문을 닫습니다.\n'
            + '9/8 일요일 4시부터 신학기 맞이 대청소를 실시 예정이며 대청소 직후 다시 문을 열 예정입니다.\n'
            + '\n'
            + '2. 카이스트 노천극장에서 이루어질 카포전 일정으로 인해\n'
            + '9/19(목) 오후 3시부터 9/21(토)에서 일요일로 넘어가는 자정까지 임시 휴무할 예정입니다!\n'
            + '\n'
            + '감사드리며 이용에 참고 부탁드리겠습니다.'
    };
    const { type, title, date, content } = __temp_post;

    return (
        <div className={style.PostPage}>
            <h1>{ title }</h1>
            <div>
                <span>
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
                </span>
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
            <p>
                { content }
            </p>
        </div>
    );

}