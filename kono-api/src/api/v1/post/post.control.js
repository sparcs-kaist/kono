import { retrieve, count } from '../../../db/models/post';
import db from '../../../db';

export const list = (req, res) => {

    const {
        filter, 
        start_index: startIndex, 
        max_size: maxSize 
    } = req.query;
    
    /* Query validity check. */
    if (filter !== undefined && filter !== 'notice' && filter !== 'lostfound') {
        res.send({ msg: 'invalid filter' });
        return;
    }

    if (startIndex === undefined) {
        startIndex = 0;
    }
    else {
        if (isNaN(parseInt(startIndex)) || startIndex < 0) {
            res.send({ msg: 'invalid start_index' });
            return;
        }
    }

    if (maxSize === undefined) {
        res.send({ msg: 'max_size required' });
        return;
    }
    else {
        if (isNaN(parseInt(maxSize)) || maxSize < 1 || maxSize > 64) {
            res.send({ msg: 'invalid max_size' });
            return;
        }
    }

    /* Fire database query. */
    // try {
    //     const rows = await db.query('SELECT * FROM post');
    //     res.send(rows);
    // } catch (err) {
    //     console.log(err);
    // }

};

export const single = (req, res) => {
    res.end('/api/v1/post/:sid');
};