import db from '../../../db';

export const list = async (req, res) => {

    const { max_size } = req.query;

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

    if (!req.admin) {
        res.status(403);
        res.send({ msg: 'login required' });
        return;
    }

    const { noti_kr, noti_en } = req.body;

    if (noti_kr) {
        if (typeof noti_kr !== 'string' || noti_kr.length > 40) {
            res.status(400);
            res.send({ msg: 'invalid noti_kr' });
            return;
        }
    }
    if (noti_en) {
        if (typeof noti_en !== 'string' || noti_en.length > 80) {
            res.status(400);
            res.send({ msg: 'invalid noti_en' });
            return;
        }
    }

    try {

        await db.authorizedInstance('noti')
            .insert({ noti_kr, noti_en });

        const [{ 'last_insert_id()': sid }] = await db.authorizedInstance
            .select(db.authorizedInstance.raw('last_insert_id()'));

        const [noti] = await db.authorizedInstance
            .select('sid', 'noti_kr', 'noti_en', 'created_time')
            .from('noti')
            .where({ sid });

        res.status(201);
        res.send(noti);

    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

};

export const updateNoti = async (req, res) => {

    if (!req.admin) {
        res.status(403);
        res.send({ msg: 'login required' });
        return;
    }

    const { sid } = req.params;
    const { noti_kr, noti_en } = req.body;

    const SID = parseInt(sid);
    if (isNaN(SID) || !Number.isSafeInteger(SID) || SID < 0) {
        res.status(400);
        res.send({ msg: 'invalid sid' });
        return;
    }

    if (noti_kr) {
        if (typeof noti_kr !== 'string' || noti_kr.length > 40) {
            res.status(400);
            res.send({ msg: 'invalid noti_kr' });
            return;
        }
    }
    if (noti_en) {
        if (typeof noti_en !== 'string' || noti_en.length > 80) {
            res.status(400);
            res.send({ msg: 'invalid noti_en' });
            return;
        }
    }

    try {

        if (noti_kr || noti_en) {

            const updateResult = await db.authorizedInstance('noti')
                .where({ sid })
                .update({
                    noti_kr,
                    noti_en
                });

            if (updateResult === 0) {
                res.status(404);
                res.send({ msg: 'noti does not exist' });
                return;
            }
            
        }

        const [noti] = await db.authorizedInstance
            .select('sid', 'noti_kr', 'noti_en', 'created_time')
            .from('noti')
            .where({ sid });

        res.status(200);
        res.send(noti);

    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

};

export const deleteNoti = async (req, res) => {

    if (!req.admin) {
        res.status(403);
        res.send({ msg: 'login required' });
        return;
    }

    const { sid } = req.params;

    const SID = parseInt(sid);
    if (isNaN(SID) || !Number.isSafeInteger(SID) || SID < 0) {
        res.status(400);
        res.send({ msg: 'invalid sid' });
        return;
    }

    try {

        const deleteResult = await db.authorizedInstance('noti')
            .where({ sid })
            .update({ deleted: 1 });

        if (deleteResult === 0) {
            res.status(404);
            res.send({ msg: 'noti does not exist' });
            return;
        }

        res.status(204);
        res.end();

    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

};