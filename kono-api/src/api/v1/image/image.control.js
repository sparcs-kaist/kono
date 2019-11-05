import db from '../../../db';
import multer from 'multer';
import uniqueString from 'unique-string';

const UPLOAD_MAX_NUM_FILES = 5;
const UPLOAD_MAX_FILE_SIZE = 10 * 1024 * 1024;
const UPLOAD_MIME_TYPES = ['image/png', 'image/jpeg'];
const UPLOAD_KEY = 'image';

export const list = async (req, res) => {

    const { filter_type = '*', start_index = 0, max_size } = req.query;

    /* Query validity check. */
    if (max_size === undefined) {
        res.status(400);
        res.send({ msg: 'max_size required' });
        return;
    }

    const FILTER_TYPE = filter_type;
    if (FILTER_TYPE !== '*' && FILTER_TYPE !== 'notice' && FILTER_TYPE !== 'lostfound') {
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

        const images = await db.instance
            .select('image.sid', 'image.url', 'image.post_sid')
            .from('post')
            .innerJoin('image', 'image.post_sid', 'post.sid')
            .where({ 'post.deleted': 0, 'post.type': FILTER_TYPE })
            .orderBy('post.created_time', 'desc')
            .limit(MAX_SIZE)
            .offset(START_INDEX);
        
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

        const data = { notice: 0, lostfound: 0 };
        await db.instance
            .select('post.type', db.instance.raw('COUNT(image.sid)'))
            .from('post')
            .innerJoin('image', 'image.post_sid', 'post.sid')
            .where({ 'post.deleted': 0 })
            .groupBy('post.type')
            .then(result => {
                result.forEach(({ 'COUNT(image.sid)': count, type }) => {
                    data[type] = count;
                })
            });

        res.status(200);
        res.send(data);

    } catch(e) {
        console.log(e);
        res.status(500);
        res.send({ msg: 'server error' });
    }

}

/* For post upload. */

class MimetypeError extends Error {
    constructor(...params) {
        super(...params);
        this.message = 'Image file mimetype undefined or unsupported.';
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_DIR)
    },
    filename: (req, file, cb) => {
        if (!UPLOAD_MIME_TYPES.includes(file.mimetype)) {
            return cb(new MimetypeError(), '');
        }
        const extension = file.mimetype.split('/').pop();
        cb(null, `${uniqueString()}.${extension}`);
    }
});

const uploadFiles = multer({ 
    storage: storage,
    limits: {
        fileSize: UPLOAD_MAX_FILE_SIZE
    }
}).array(UPLOAD_KEY, UPLOAD_MAX_NUM_FILES);

export const upload = async (req, res) => {
    uploadFiles(req, res, (err) => {
        if (err) {
            res.status(400);
            res.send({ msg: err.toString() });
        } else if (!req.files) {
            console.log('req.files undefined.');
            res.status(500);
            res.send({ msg: 'server error' });
        } else {
            res.status(200);
            res.send(req.files.map(file => file.path));
        }
    });
};