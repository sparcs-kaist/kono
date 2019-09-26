import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from '../styles/PostPageView.module.scss';
import StaticContent from './StaticContent';
import Button from './Button';
import MaterialIcon from './MaterialIcon';
import PostHeader from './PostHeader';
import ImageGridPanel from './ImageGridPanel';
import FullScreenPanel from './FullScreenPanel';
import FullScreen from 'react-full-screen';
import * as FullscreenActions from '../store/modules/fullscreen';

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
        default:
            return '';
    }
}

function getDateString(date, language) {
    return date.toLocaleString('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

export default ({ post }) => {

    if (!post)
        return null;

    const dispatch = useDispatch();

    const login = useSelector(state => state.auth.login, []);
    const language = useSelector(state => state.config.language, []);
    const showFullScreen = useSelector(state => state.fullscreen.visible, []);

    const onChangeFullScreen = (value) => { dispatch(FullscreenActions.SetVisible(value)); };

    const header = {
        type : getTypeString(post.type, language),
        title: post[`title_${language}`],
        date : getDateString(post.date, language)
    };
    const textContentURL = post[`content_${language}`];
    const imgContentURLs = post.content_img;

    const showEditButton = (login === 'logged');
    const showImageThumbnails = (imgContentURLs && imgContentURLs.length > 0);

    return (
        <div className={style.PostPageView}>
            <PostHeader header={header} />
            <div className={style.PostPageView__content}>
                {
                    showImageThumbnails && (
                        <div className={style.PostPageView__thumbnails}>
                            <ImageGridPanel
                                gridNumRows={1}
                                gridNumColumns={3}
                                totalWidthPixels={800}
                                imageURLs={imgContentURLs} 
                                useDynamicPositioning 
                                useOnClick />
                        </div>
                    )
                }
                <div className={style.PostPageView__text}>
                    <StaticContent url={textContentURL} />
                </div>
            </div>
            <div className={style.PostPageView__footer}>
                <a href="/">
                    <Button round>
                        <MaterialIcon>arrow_back</MaterialIcon>
                    </Button>
                </a>
                {
                    showEditButton && (
                        <Button round>
                            <MaterialIcon>edit</MaterialIcon>
                        </Button>
                    )
                }
            </div>
            <FullScreen 
                enabled={showFullScreen}
                onChange={onChangeFullScreen}>
                {
                    showFullScreen && (
                        <FullScreenPanel />
                    )
                }
            </FullScreen>
        </div>
    );

}