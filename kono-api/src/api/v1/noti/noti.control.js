import db from '../../../db';

export const list = async (req, res) => {

    res.status(200);
    res.send('GET /api/v1/noti');

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