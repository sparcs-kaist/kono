import db from '../../../db';

export const count = async (req, res) => {

    /* Fire database query. */
    try {

        const data = { notice: 0, lostfound: 0 };
        await db.instance
            .select(db.instance.raw('COUNT(sid)'), 'type')
            .from('post')
            .where({ deleted: 0 })
            .groupBy('type')
            .then(result => {
                result.forEach(({ 'COUNT(sid)': count, type }) => data[type] = count);
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

    const { filter_type = '%', start_index = 0, max_size } = req.query;
    
    /* Query validity check. */
    if (max_size === undefined) {
        res.status(400);
        res.send({ msg: 'max_size required' });
        return;
    }

    const FILTER_TYPE = filter_type;
    if (FILTER_TYPE !== '%' && FILTER_TYPE !== 'notice' && FILTER_TYPE !== 'lostfound') {
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

        const posts = await db.instance
            .select('sid', 'type', 'title_kr', 'title_en', 'created_time', 
                db.instance
                    .select('url')
                    .from('image')
                    .whereRaw('image.post_sid = post.sid')
                    .orderBy('sid')
                    .limit(1)
                    .as('thumbnail'))
            .from('post')
            .where('deleted', 0)
            .where('type', 'like', FILTER_TYPE)
            .orderBy('created_time', 'desc')
            .limit(MAX_SIZE)
            .offset(START_INDEX);

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
        
        const post = await db.instance
            .select('post.*', 'image.url')
            .from('post')
            .leftJoin('image', 'post.sid', 'image.post_sid')
            .where({ 'post.sid': SID })
            .then(result => {
                if (result.length == 0)
                    return null;
                const { url, deleted, ...row } = result[0];
                if (deleted === 1)
                    return null;
                return {
                    ...row,
                    content_img: result.map(row => row.url).filter(e => !!e)
                }
            })

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
