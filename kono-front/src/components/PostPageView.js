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
import useLanguages from '../lib/hooks/useLanguages';

function getDateString(date) {
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
    const showFullScreen = useSelector(state => state.fullscreen.visible, []);

    const onChangeFullScreen = (value) => { dispatch(FullscreenActions.SetVisible(value)); };

    const header = {
        type : post.type,
        title: {
            kr: post['title_kr'],
            en: post['title_en']
        },
        date : getDateString(post.date)
    };
    const textContentURL = {
        kr: post['content_kr'],
        en: post['content_en']
    }
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
                    <StaticContent url={useLanguages(textContentURL)} />
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