import db from '..';
import crypto from 'crypto';

function hash(password) {
    const { PASSWORD_KEY: secret } = process.env;
    return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

export const verify = (password, onSuccess, onFailure, onError) => {
    db.query('SELECT * from admin', (err, rows) => {
        if (err) {
            console.log(err);
            if (onError)
                onError();
        }
        else {
            const pwd = rows[0].password;
            if (hash(password) === pwd && onSuccess)
                onSuccess();
            else if (onFailure)
                onFailure();
        }
    });
}

export const update = (newPassword, onSuccess, onError) => {
    db.query(`UPDATE admin SET password = "${hash(newPassword)}"`, (err) => {
        if (err) {
            console.log(err);
            if (onError)
                onError();
        }
        else if (onSuccess)
            onSuccess();
    });
}