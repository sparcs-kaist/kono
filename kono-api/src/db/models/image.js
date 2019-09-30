import db from '..';

const columns = [
    'sid',
    'url',
    'post_sid'
];

function checkValidity(column, value) {
    switch (column) {
        case 'sid':
            if (typeof(value) !== 'number')
                throw new Error(`invalid type for sid: ${typeof(value)}`);
            if (value <= 0)
                throw new Error(`invalid value for sid: ${value}`);
            break;
        case 'url':
            if (typeof(value) !== 'string')
                throw new Error(`invalid type for url: ${typeof(value)}`);
            break;
        case 'post_sid':
            if (typeof(value) !== 'number')
                throw new Error(`invalid type for post_sid: ${typeof(value)}`);
            if (value <= 0)
                throw new Error(`invalid value for post_sid: ${value}}`);
            break;
        default:
            throw new Error(`invalid column name: ${column}}`);
    }
    return true;
}

function getFilterQueryString(filter) {
    return Object.keys(filter)
        .map(key => `${key} = ${typeof(filter[key]) === 'string' ? `\"${filter[key]}\"` : filter[key]}`)
        .join(' AND ');
}

export const retrieve = (retrieveQuery) => {

    const { filter, select, maxSize } = retrieveQuery;

    /* Argument validty check. */
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
    if (typeof(maxSize) !== 'number')
        throw new Error(`invalid type for maxSize: ${maxSize}`);
    if (maxSize < 1 || maxSize > 64)
        throw new Error(`invalid value for maxSize: ${maxSize}`);

    const fn = `SELECT ${select === undefined ? '*' : `${select.join(', ')}`} FROM image`
        + ' WHERE ' + getFilterQueryString(filter)
        + ` LIMIT ${maxSize}`;

    console.log(`image.retrieve: ${fn}`);

    return db.query(fn);

}