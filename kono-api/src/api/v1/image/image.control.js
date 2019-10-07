import * as Post from '../../../db/models/post';
import * as Image from '../../../db/models/image';

export const list = async (req, res) => {

    const { filter_type = undefined, start_index = 0, max_size } = req.query;

    /* Query validity check. */
    if (max_size === undefined) {
        res.status(400);
        res.send({ msg: 'max_size required' });
        return;
    }

    const FILTER_TYPE = filter_type;
    if (FILTER_TYPE !== undefined && FILTER_TYPE !== 'notice' && FILTER_TYPE !== 'lostfound') {
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

        await Post.select({
                select: [],
                filter: { deleted: false, type: FILTER_TYPE },
                limit: { min: START_INDEX, length: MAX_SIZE },
                sort: { by: 'created_time', order: 'DESC' },
                join: [ Image.innerJoin({
                    on: 'post_sid',
                    select: [ 'sid', 'url', 'post_sid' ]
                }) ]
            })
            .then(res => {
                console.log(res);
            });
        res.status(200);
        res.send({});

    } catch(e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

};

export const count = async (req, res) => {

    res.status(200);
    res.send({ msg: 'GET /api/v1/image/count' });

}