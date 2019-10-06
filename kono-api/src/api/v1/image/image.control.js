

export const list = async (req, res) => {

    res.status(200);
    res.send({ msg: 'GET /api/v1/image' });

}

export const count = async (req, res) => {

    res.status(200);
    res.send({ msg: 'GET /api/v1/image/count' });

}