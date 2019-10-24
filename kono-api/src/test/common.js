import knex from 'knex';

const {
    NODE_ENV,
    HOST_TEST,
    PORT_TEST
} = process.env;

export const apiURL = `http://${HOST_TEST}:${PORT_TEST}`;
export const nodeEnv = NODE_ENV === 'development' ? 'development' : 'production';
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