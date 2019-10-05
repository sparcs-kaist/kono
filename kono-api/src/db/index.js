import mysql from 'mysql';

export default (() => {

    return {
        init() {
            this._pool = mysql.createPool({
                connectionLimit: 16,
                host: process.env['DB_HOST'],
                port: process.env['DB_PORT'],
                user: process.env['DB_USER'],
                password: process.env['DB_PASSWORD'],
                database: process.env['DB_DATABASE']
            });
        },
        query(fn) {
            return new Promise((resolve, reject) => {
                this._pool.query(fn, (err, rows, fields) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows, fields);
                });
            });
        }
    };

})();