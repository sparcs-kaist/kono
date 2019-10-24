import knex from 'knex';
import dockerConfig from '../lib/docker.config';

export default (() => {

    return {
        init() {

            const {
                NODE_ENV,
                DB_HOST,
                DB_PORT,
                DB_AUTH_USER,
                DB_USER,
                DB_DATABASE
            } = process.env;
			const DB_PASSWORD = process.env.DB_PASSWORD || dockerConfig.env.DB_PASSWORD;
			const DB_AUTH_PASSWORD = process.env.DB_AUTH_PASSWORD || dockerConfig.env.DB_AUTH_PASSWORD;

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
