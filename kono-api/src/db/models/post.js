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

function checkValidity(column, value) {
    switch (column) {
        case 'sid':
            if (typeof(value) !== 'number')
                throw new Error(`invalid type for sid: ${typeof(value)}`);
            if (value <= 0)
                throw new Error(`invalid value for sid: ${value}`);
            break;
        case 'type':
            if (typeof(value) !== 'string')
                throw new Error(`invalid type for type: ${typeof(value)}`);
            if (value !== 'notice' && value !== 'lostfound')
                throw new Error(`invalid value for type: ${value}`);
            break;
        case 'title_kr':
            break;
        case 'title_en':
            break;
        case 'created_time':
            break;
        case 'content_kr':
            break;
        case 'content_en':
            break;
        case 'deleted':
            if (typeof(value) !== 'boolean')
                throw new Error(`invalid type for deleted: ${typeof(value)}`);
            break;
        default:
            throw new Error(`invalid column name: ${column}`);
    }
    return true;
}

function getFilterQueryString(filter) {
    return Object.keys(filter)
        .map(key => `${key} = ${typeof(filter[key]) === 'string' ? `\"${filter[key]}\"` : filter[key]}`)
        .join(' AND ');
}

export const count = (countQuery) => {

    const { filter } = countQuery || {};

    /* Argument validity check. */
    if (Object.keys(filter).length == 0)
        throw new Error('should provide at least one filter');
    Object.keys(filter).every(key => checkValidity(key, filter[key]));

    const fn = 'SELECT COUNT(*) FROM post'
        + ' WHERE ' + getFilterQueryString(filter);

    console.log('post.count: ' + fn);

    return db.query(fn).then(result => result[0]['COUNT(*)']);

};

export const retrieve = (retrieveQuery) => {

    const { filter, select, startIndex, maxSize } = retrieveQuery || {};

    /* Argument validity check. */
    if (!maxSize)
        throw new Error('maxSize field required in retrieveQuery');
    if (Object.keys(filter).length == 0)
        throw new Error('should provide at least one filter');
    Object.keys(filter).every(key => checkValidity(key, filter[key]));
    if (select) {
        if (typeof(select) !== 'object')
            throw new Error(`invalid type for select: ${typeof(select)}`);
        if (!select.every(el => columns.some(col => el === col)))
            throw new Error(`invalid value for select: ${select}`);
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
        + ' WHERE ' + getFilterQueryString(filter)
        + ` ORDER BY created_time DESC`
        + ` LIMIT ${(startIndex ? startIndex : 0)}, ${maxSize}`;

    console.log('post.retrieve: ' + fn);

    return db.query(fn);

};