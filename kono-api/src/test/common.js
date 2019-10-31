import knex from 'knex';

export const apiURL = process.env.API_URL_TEST;
export const password = process.env.API_PASSWORD;

export const db = (() => {

    return {
        init() {
            const {
                DB_HOST_TEST,
                DB_PORT_TEST,
                DB_USER_TEST,
                DB_DATABASE_TEST
            } = process.env;
            this.instance = knex({
                client: 'mysql',
                connection: {
                    host: DB_HOST_TEST,
                    port: DB_PORT_TEST,
                    user: DB_USER_TEST,
                    database: DB_DATABASE_TEST
                }
            });
        }
    };

})();
