import mysql from 'mysql';

export default (() => {

    let host, port, user, password, database;

    return {
        init() {
            host = process.env['DB_HOST'];
            port = process.env['DB_PORT'];
            user = process.env['DB_USER'];
            password = process.env['DB_PASSWORD'];
            database = process.env['DB_DATABASE'];
        },
        query(fn) {
            return new Promise((resolve, reject) => {
                const connection = mysql.createConnection({ host, port, user, password, database });
                connection.connect();
                connection.query(fn, (err, rows, fields) => {
                    if (err)
                        reject(err);
                    else
                        resolve(rows, fields);
                });
                connection.end();
            });
        }
    };

})();