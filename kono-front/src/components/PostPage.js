import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PostPageView from './PostPageView';
import * as FullscreenActions from '../store/modules/fullscreen';
import * as PostAPI from '../api/post';

export default ({ match }) => {

    const dispatch = useDispatch();
    const [post, setPost] = useState({ });

    const { 'post_id': postSID } = match.params;

    const fetchPost = async (postSID) => {
        await PostAPI.single(postSID)
            .then(({ data }) => {
                setPost({ ...data });
            });
    };
    
    useEffect(() => {
        fetchPost(postSID);
    }, [postSID])

    useEffect(() => {
        if (post.content_img)
            dispatch(FullscreenActions.SetImageURLs(post.content_img));
    }, [dispatch, post]);

    return (
        <PostPageView post={post} />
    );

}