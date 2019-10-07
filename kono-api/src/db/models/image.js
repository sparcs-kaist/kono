import { createModel } from '../lib/model';

export default createModel('image', [
    {
        key: 'sid',
        type: 'integer',
        nullable: false,
        verifier(sid) { return sid >= 0; }
    },
    {
        key: 'url',
        type: 'string'
    },
    {
        key: 'post_sid',
        type: 'integer',
        nullable: false,
        verifier(post_sid) { return post_sid >= 0; },
        fk: 'post.sid'
    }
]);