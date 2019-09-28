import db from '..';

const columns = [
    'sid',
    'type',
    'title_kr',
    'title_en',
    'created_time',
    'content_kr',
    'content_en',
    'deleted'
];

export const count = (countQuery) => {

    const { filter } = countQuery || {};
    const { type } = filter || {};

    if (type) {
        if (type !== 'notice' && type !== 'lostfound')
            throw new Error(`invalid filter type: ${type}`);
    }

    const fn = 'SELECT COUNT(*) FROM post'
        + ' WHERE deleted = 0'
        + (type ? ` AND type = "${type}"` : '');

    return db.query(fn).then(result => result[0]['COUNT(*)']);

};

export const retrieve = (retrieveQuery) => {

    const { filter, select, startIndex, maxSize } = retrieveQuery || {};
    const { type } = filter || {};

    if (!maxSize)
        throw new Error('maxSize field required in retrieveQuery');
    if (type) {
        if (type !== 'notice' && type !== 'lostfound')
            throw new Error(`invalid filter type: ${type}`);
    }
    if (select) {
        if (typeof(select) !== 'object')
            throw new Error(`invalid type for select: ${typeof(select)}`);
        if (!select.every(el => columns.some(col => el === col)))
            throw new Error(`invalid column name for select: ${select}}`);
    }
    if (startIndex) {
        if (typeof(startIndex) !== 'number')
            throw new Error(`invalid type for startIndex: ${typeof(startIndex)}`);
        if (startIndex < 0 || isNaN(startIndex))
            throw new Error(`invalid value for startIndex: ${startIndex}`);
    }
    if (typeof(maxSize) !== 'number')
        throw new Error(`invalid type for maxSize: ${maxSize}`);
    if (maxSize < 1 || maxSize > 64)
        throw new Error(`invalid value for maxSize: ${maxSize}`);

    const fn = `SELECT ${select === undefined ? '*' : `${select.join(', ')}`} FROM post`
        + ' WHERE deleted = 0'
        + (type ? ` AND type = "${type}"` : '')
        + ` ORDER BY created_time DESC`
        + ` LIMIT ${(startIndex ? startIndex : 0)}, ${maxSize}`;

    return db.query(fn);

};