import db from '..';
import crypto from 'crypto';

function hash(password) {
    const { PASSWORD_KEY: secret } = process.env;
    return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

export const verify = (password, onSuccess, onFailure) => {
    db.query('SELECT * from admin', (rows) => {
        const pwd = rows[0].password;
        if (hash(password) === pwd && onSuccess)
            onSuccess();
        else if (onFailure)
            onFailure();
    });
}