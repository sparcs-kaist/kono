import db from '../../../db';

export const recentSingle = async (req, res) => {
    const { room_number } = req.params;

    /* Query validity check. */
    const ROOM_NUMBER = parseInt(room_number);
    if (isNaN(ROOM_NUMBER) || !Number.isSafeInteger(ROOM_NUMBER) || ROOM_NUMBER <= 0) {
        res.status(400);
        res.send({ msg: 'invalid room number' });
        return;
    }

    /* Fire database query. */
    try {

        const room = await db.instance
            .select('state', 'timestamp')
            .from('room')
            .where({ room_number: ROOM_NUMBER })
            .orderBy('timestamp', 'desc')
            .limit(1)
            .then(result => {
                if (result.length === 0)
                    return null;
                return result[0];
            });

        if (room) {
            res.status(200);
            res.send(room);
        }
        else {
            res.status(404);
            res.send({ msg: 'room does not exist' });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }
};

export const recentList = async (req, res) => {

    /* Fire database query. */
    try {

        const room = await db.instance
            .select('room_number', 'state', 'timestamp')
            .from(db.instance.raw('room r1'))
            .where('timestamp', (builder) => { 
                builder
                .max('timestamp')
                .from(db.instance.raw('room r2'))
                .where(db.instance.raw('r1.room_number = r2.room_number'))})
            .orderBy('room_number')
            .then(result => {
                if (result.length === 0)
                    return null;
                return result;
            });

        if (room) {
            res.status(200);
            res.send(room);
        }
        else {
            res.status(404);
            res.send({ msg: 'no room data exists' });
        }
    } catch (e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }
};