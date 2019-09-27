import db from '..';

export const count = (countQuery) => {

    const { filter } = countQuery || {};
    const { type } = filter || {};

    if (type) {
        if (type !== 'notice' || type !== 'lostfound')
            throw new Error('invalid filter type');
    }

    const fn = 'SELECT COUNT(*) FROM post'
        + ' WHERE deleted = 0'
        + (type ? ` AND type = ${type}` : '');

    return db.query(fn).then(result => result[0]['COUNT(*)']);

};

export const retrieve = (retrieveQuery) => {



};