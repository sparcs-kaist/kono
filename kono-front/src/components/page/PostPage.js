import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PostPageView } from 'components/post';
import * as FullscreenActions from 'store/modules/fullscreen';
import * as PostAPI from 'api/post';
import { useFetch } from 'lib/hooks';

export default ({ match }) => {

    const { 'post_id': postSID } = match.params;

    const dispatch = useDispatch();
    const [
        post,
        fetchPost,
        , // isLoading
        isErrorPost,
        PostErrorHandler
    ] = useFetch({});

    useEffect(() => {
        fetchPost(PostAPI.single, [postSID]);
    }, [fetchPost, postSID])

    useEffect(() => {
        if (post.content_img)
            dispatch(FullscreenActions.SetImageURLs(post.content_img));
    }, [post, dispatch]);

    return (
        <>
        {
            <PostErrorHandler width={800} height={500} showErrorText showSpinner showBackground/>
        }
        {
            !isErrorPost && <PostPageView post={post} />
        }
        </>
    );

}