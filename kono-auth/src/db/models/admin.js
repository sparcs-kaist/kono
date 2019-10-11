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
            for (let { sid, password: passwordHash } of rows) {
                if (hash(password) === passwordHash) { // Login Success
                    if (onSuccess)
                        onSuccess({ sid });
                    return;
                }
            }
            // Login Failure
            if (onFailure)
                onFailure();
        }
    });
}

export const update = (admin, newPassword, onSuccess, onError) => {
    const { sid } = admin;
    db.query(`UPDATE admin SET password = "${hash(newPassword)}" WHERE sid=${sid}`, (err) => {
        if (err) {
            console.log(err);
            if (onError)
                onError();
        }
        else if (onSuccess)
            onSuccess({ sid });
    });
}