import * as Post from '../../../db/models/post';
import { retrieve as imageRetrieve } from '../../../db/models/image';

export const list = async (req, res) => {

    const { filter_type = undefined, start_index = 0, max_size } = req.query;
    
    /* Query validity check. */
    if (max_size === undefined) {
        res.status(400);
        res.send({ msg: 'max_size required' });
        return;
    }

    const FILTER_TYPE = filter_type;
    if (filter_type !== undefined && filter_type !== 'notice' && filter_type !== 'lostfound') {
        res.status(400);
        res.send({ msg: 'invalid filter_type' });
        return;
    }

    const START_INDEX = parseInt(start_index);
    if (isNaN(START_INDEX) || !Number.isSafeInteger(START_INDEX) || START_INDEX < 0) {
        res.status(400);
        res.send({ msg: 'invalid start_index' });
        return;
    }
    
    const MAX_SIZE = parseInt(max_size);
    if (isNaN(MAX_SIZE) || !Number.isSafeInteger(MAX_SIZE) || MAX_SIZE < 1 || MAX_SIZE > 64) {
        res.status(400);
        res.send({ msg: 'invalid max_size' });
        return;
    }

    /* Fire database query. */
    try {

        const size = await Post.select({
            filter: { deleted: false, type: FILTER_TYPE },
            select: ['COUNT(*)']
        }).then(row => row[0]['COUNT(*)']);
        const posts = await Post.select({
            limit: { min: START_INDEX, length: MAX_SIZE },
            filter: { deleted: false, type: FILTER_TYPE },
            select: ['sid', 'type', 'title_kr', 'title_en', 'created_time'],
            sort: { by: 'created_time', order: 'DESC' }
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
    const SID = parseInt(sid);
    if (isNaN(SID) || !Number.isSafeInteger(SID) || SID <= 0) {
        res.status(400);
        res.send({ msg: 'invalid sid' });
        return;
    }

    /* Fire database query. */
    try {

        const [post] = await Post.select({
            filter: { sid: SID },
            limit: { length: 1 }
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
