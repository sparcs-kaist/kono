import { createModel } from '../lib/model';

const postModel = createModel('post', [
    {
        key: 'sid',
        type: 'integer',
        nullable: false,
        verifier(sid) { return sid >= 0; }
    },
    {
        key: 'type',
        type: 'string',
        nullable: false,
        verifier(type) { return (type === 'notice') || (type === 'lostfound'); }
    },
    {
        key: 'title_kr',
        type: 'string'
    },
    {
        key: 'title_en',
        type: 'string'
    },
    {
        key: 'created_time',
        type: 'Date',
        nullable: false
    },
    {
        key: 'content_kr',
        type: 'string'
    },
    {
        key: 'content_en',
        type: 'string'
    },
    {
        key: 'deleted',
        type: 'boolean',
        nullable: false
    }
]);

export const count = (column) => postModel.count(column);
export const select = (query) => postModel.select(query);