import Post from '../../../db/models/post';
import Image from '../../../db/models/image';

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

        const images = await Post.select({
                select: [],
                where: [ 
                    Post.where(Post.column('deleted'), false), 
                    Post.where(Post.column('type'), FILTER_TYPE)
                ],
                limit: { min: START_INDEX, length: MAX_SIZE },
                sort: { by: Post.column('created_time'), order: 'DESC' },
                join: [ Image.innerJoin({
                    on: Image.column('post_sid'),
                    select: [ 
                        Image.column('sid'),
                        Image.column('url'),
                        Image.column('post_sid')
                    ]
                }) ]
            });
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
        await Post.select({
                select: [ Post.column('type') ],
                where: [ Post.where(Post.column('deleted'), false) ],
                group: Post.column('type'),
                join: [ Image.innerJoin({
                    on: Image.column('post_sid'),
                    select: [ Image.count(Image.column('sid')) ]
                }) ]
            })
            .then(result => {
                result.forEach(({ 
                    [Image.count(Image.column('sid')).selectorString]: count, 
                    type 
                }) => { data[type] = count; });
            });

        res.status(200);
        res.send(data);

    } catch(e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

}