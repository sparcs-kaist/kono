import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PostPageView from './PostPageView';
import * as FullscreenActions from '../store/modules/fullscreen';
import * as PostAPI from '../api/post';
import useFetch from '../lib/hooks/useFetch';

export default ({ match }) => {

    const { 'post_id': postSID } = match.params;

    const dispatch = useDispatch();
    const [
        post,
        fetchPost,
        PostErrorHandler,
        showPostErrorHandler
    ] = useFetch(
        {}, // initialValue
        { // apihttp://localhost:3000/post/9
            fn: PostAPI.single,
            args: [ postSID ]
        }
    );

    useEffect(() => {
        fetchPost();
    }, [postSID])

    useEffect(() => {
        if (post.content_img)
            dispatch(FullscreenActions.SetImageURLs(post.content_img));
    }, [dispatch, post]);

    return (
        <>
        {
            <PostErrorHandler width={800} height={500} showErrorText showSpinner showBackground/>
        }
        {
            !showPostErrorHandler && <PostPageView post={post} />
        }
        </>
    );

}