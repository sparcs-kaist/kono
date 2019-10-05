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
        verifier(post_sid) { return post_sid >= 0; }
    }
]);

/**
  * 
  * @param {{filter: object, select: [string], limit: {min: number, length: number}[], sort: {by: string, order: string}}} query 
  */
export const select = (query) => imageModel.select(query);