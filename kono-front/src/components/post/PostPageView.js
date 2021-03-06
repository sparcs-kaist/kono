import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullScreen from 'react-full-screen';
import style from 'styles/PostPageView.module.scss';
import { StaticContent, Button, MaterialIcon, GridPanel } from 'components/common';
import { PostHeader, FullScreenPanel } from 'components/post';
import * as FullscreenActions from 'store/modules/fullscreen';
import { useLanguages } from 'lib/hooks';

export default ({ post }) => {

    const {
        sid,
        type, 
        title_kr,
        title_en, 
        created_time, 
        content_kr, 
        content_en, 
        content_img
    } = post;

    if (!sid)
        return null;

    const showContent = (content_kr || content_en);
    const contentURL = (content_kr && content_en) 
        ? useLanguages({ kr: content_kr, en: content_en })[0]
        : content_kr;

    const dispatch = useDispatch();

    const login = useSelector(state => state.auth.login, []);
    const showFullScreen = useSelector(state => state.fullscreen.visible, []);

    const onChangeFullScreen = (value) => { dispatch(FullscreenActions.SetVisible(value)); };

    const showEditButton = (login === 'logged');
    const showImageThumbnails = (content_img && content_img.length > 0);

    return (
        <div className={style.PostPageView}>
            <PostHeader
                type={type}
                title={{ kr: title_kr, en: title_en }}
                date={new Date(created_time)}
            />
            <div className={style.PostPageView__content}>
                {
                    showImageThumbnails && (
                        <div className={style.PostPageView__thumbnails}>
                            <GridPanel
                                gridNumRows={1}
                                gridNumColumns={3}
                                totalWidthPixels={800}
                                imageURLs={content_img} 
                                useDynamicPositioning 
                                useOnClick
                                useOverlapFilter/>
                        </div>
                    )
                }
                {
                    showContent && (
                        <div className={style.PostPageView__text}>
                            <StaticContent url={contentURL} />
                        </div>
                    )
                }
            </div>
            <div className={style.PostPageView__footer}>
                <a href="/">
                    <Button round>
                        <MaterialIcon md20>arrow_back</MaterialIcon>
                    </Button>
                </a>
                {
                    showEditButton && (
                        <Button round>
                            <MaterialIcon md20>edit</MaterialIcon>
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