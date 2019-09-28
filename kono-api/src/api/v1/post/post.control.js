import { retrieve, count } from '../../../db/models/post';

export const list = async (req, res) => {

    const {
        filter, 
        start_index: startIndex, 
        max_size: maxSize 
    } = req.query;
    
    /* Query validity check. */
    if (filter !== undefined && filter !== 'notice' && filter !== 'lostfound') {
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
    try {

        const size = await count({
            filter: { type: filter }
        });

        const posts = await retrieve({
            filter: { type: filter },
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

export const single = (req, res) => {
    res.end('/api/v1/post/:sid');
};