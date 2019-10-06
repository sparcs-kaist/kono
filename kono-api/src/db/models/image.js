import { createModel } from '../lib/model';

const imageModel = createModel('image', [
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

Object.keys(imageModel).forEach(key => {
    module.exports[key] = (...args) => imageModel[key](...args);
});