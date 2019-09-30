import { retrieve as postRetrieve, count } from '../../../db/models/post';
import { retrieve as imageRetrieve } from '../../../db/models/image';

export const list = async (req, res) => {

    const {
        filter_type, 
        start_index: startIndex, 
        max_size: maxSize 
    } = req.query;
    
    /* Query validity check. */
    if (filter_type !== undefined && filter_type !== 'notice' && filter_type !== 'lostfound') {
        res.status(400);
        res.send({ msg: 'invalid filter' });
        return;
    }

    if (startIndex === undefined) {
        startIndex = 0;
    }
    else {
        if (isNaN(parseInt(startIndex)) || startIndex < 0) {
            res.status(400);
            res.send({ msg: 'invalid start_index' });
            return;
        }
    }

    if (maxSize === undefined) {
        res.status(400);
        res.send({ msg: 'max_size required' });
        return;
    }
    else {
        if (isNaN(parseInt(maxSize)) || maxSize < 1 || maxSize > 64) {
            res.status(400);
            res.send({ msg: 'invalid max_size' });
            return;
        }
    }

    /* Fire database query. */
    const filter = {
        type: filter_type,
        deleted: false
    };
    Object.keys(filter).forEach(key => filter[key] === undefined && delete filter[key]);

    try {

        const size = await count({
            filter
        });

        const posts = await postRetrieve({
            filter,
            select: [ 
                'sid', 
                'type', 
                'title_kr', 
                'title_en',
                'created_time'
            ],
            startIndex: parseInt(startIndex),
            maxSize: parseInt(maxSize)
        });

        res.status(200);
        res.send({ size, posts });

    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

};

export const single = async (req, res) => {

    const { sid } = req.params;

    /* Query validity check. */
    if (isNaN(parseInt(sid)) || sid <= 0) {
        res.status(400);
        res.send({ msg: 'invalid sid' });
        return;
    }

    /* Fire database query. */
    const filter = { sid: parseInt(sid) };
    
    try {

        const [post] = await postRetrieve({
            filter,
            select: [
                'sid',
                'type',
                'title_kr',
                'title_en',
                'created_time',
                'content_kr',
                'content_en',
                'deleted'
            ],
            maxSize: 1
        });

        if (!post || post.deleted === 1) {
            res.status(404);
            res.send({ msg: 'post does not exist' });
            return;
        }

        const { deleted, ...data } = post;

        const contentImages = await imageRetrieve({
            filter: { post_sid: post.sid },
            select: [
                'url'
            ],
            maxSize: 64
        }).then(rows => rows.map(row => row.url));

        res.status(200);
        res.send({ 
            ...data, 
            'content_img': contentImages
        });

    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

};