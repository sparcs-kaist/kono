import knex from 'knex';

export default (() => {

    return {
        init() {

            const {
                NODE_ENV,
                DB_HOST,
                DB_PORT,
                DB_AUTH_USER,
                DB_AUTH_PASSWORD,
                DB_USER,
                DB_PASSWORD,
                DB_DATABASE
            } = process.env;

            this.instance = knex({
                client: 'mysql',
                connection: {
                    host: DB_HOST,
                    user: DB_USER,
                    password: DB_PASSWORD,
                    database: DB_DATABASE,
                    port: DB_PORT
                },
                debug: (NODE_ENV === 'development')
            });

            this.authorizedInstance = knex({
                client: 'mysql',
                connection: {
                    host: DB_HOST,
                    user: DB_AUTH_USER,
                    password: DB_AUTH_PASSWORD,
                    database: DB_DATABASE,
                    port: DB_PORT
                },
                debug: (NODE_ENV === 'development')
            });

        }
    };

})();