import db from '../../../db';

export const list = async (req, res) => {

    const { max_size } = req.query;

    /* Query validity check. */
    if (max_size === undefined) {
        res.status(400);
        res.send({ msg: 'invalid max_size' });
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

        const notis = await db.instance
            .select('sid', 'noti_kr', 'noti_en', 'created_time')
            .from('noti')
            .where({ deleted: 0 })
            .orderBy([ 
                {
                    column: 'created_time', 
                    order: 'desc'
                },
                {
                    column: 'sid', 
                    order: 'desc'
                }
            ])
            .limit(MAX_SIZE);

        res.status(200);
        res.send(notis);

    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

};

export const createNoti = async (req, res) => {

    res.status(200);
    res.send('POST /api/v1/noti');

};

export const updateNoti = async (req, res) => {

    res.status(200);
    res.send('PUT /api/v1/noti/:sid');

};

export const deleteNoti = async (req, res) => {

    res.status(200);
    res.send('DELETE /api/v1/noti/:sid')

};