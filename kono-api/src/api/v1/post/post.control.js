import * as Post from '../../../db/models/post';
import * as Image from '../../../db/models/image';

export const count = async (req, res) => {

    /* Fire database query. */
    try {

        const data = {};
        await Post.select({
                where: [ Post.where(Post.column('deleted'), false) ],
                select: [ Post.count(Post.column('sid')), Post.column('type') ],
                group: Post.column('type')
            })
            .then(result => {
                result.forEach(({ [Post.count(Post.column('sid')).selectorString]: count, type }) => data[type] = count);
            });

        res.status(200);
        res.send(data);

    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

}

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

        const posts = await Post.select({
            limit: { min: START_INDEX, length: MAX_SIZE },
            where: [
                Post.where(Post.column('deleted'), false), 
                Post.where(Post.column('type'), FILTER_TYPE)
            ],
            select: [
                Post.column('sid'),
                Post.column('type'),
                Post.column('title_kr'),
                Post.column('title_en'),
                Post.column('created_time')
            ],
            sort: { by: Post.column('created_time'), order: 'DESC' }
        });

        res.status(200);
        res.send(posts);

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

        const post = await Post.select({
                where: [ Post.where(Post.column('sid'), SID) ],
                join: [
                    Image.innerJoin({ 
                        on: Image.column('post_sid'), 
                        select: [ Image.column('url') ] 
                    })
                ]
            })
            .then(result => {
                if (result.length === 0)
                    return null;
                const { url, deleted, ...row } = result[0];
                if (deleted === 1)
                    return null;
                return {
                    ...row,
                    content_img: result.map(row => row.url)
                };
            });

        if (post) {
            res.status(200);
            res.send(post);
        }
        else {
            res.status(404);
            res.send({ msg: 'post does not exist' });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

};
