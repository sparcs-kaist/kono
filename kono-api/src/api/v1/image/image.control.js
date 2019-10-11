// import Post from '../../../db/models/post';
// import Image from '../../../db/models/image';
import db from '../../../db';

export const list = async (req, res) => {

    const { filter_type = '*', start_index = 0, max_size } = req.query;

    /* Query validity check. */
    if (max_size === undefined) {
        res.status(400);
        res.send({ msg: 'max_size required' });
        return;
    }

    const FILTER_TYPE = filter_type;
    if (FILTER_TYPE !== '*' && FILTER_TYPE !== 'notice' && FILTER_TYPE !== 'lostfound') {
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

        const images = await db.instance
            .select('image.sid', 'image.url', 'image.post_sid')
            .from('post')
            .innerJoin('image', 'image.post_sid', 'post.sid')
            .where({ 'post.deleted': 0, 'post.type': FILTER_TYPE })
            .orderBy('post.created_time', 'desc')
            .limit(MAX_SIZE)
            .offset(START_INDEX);
        
        res.status(200);
        res.send(images);

    } catch(e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

};

export const count = async (req, res) => {

    try {

        const data = {};
        await db.instance
            .select('post.type', db.instance.raw('COUNT(image.sid)'))
            .from('post')
            .innerJoin('image', 'image.post_sid', 'post.sid')
            .where({ 'post.deleted': 0 })
            .groupBy('post.type')
            .then(result => {
                result.forEach(({ 'COUNT(image.sid)': count, type }) => {
                    data[type] = count;
                })
            });

        res.status(200);
        res.send(data);

    } catch(e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

}