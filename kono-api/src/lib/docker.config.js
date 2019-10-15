import { readFile } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);
const processText = res => res.toString().trim();

export default (() => {

    const {
	DB_AUTH_PASSWORD_FILE,
	DB_PASSWORD_FILE,
	PASSWORD_KEY_FILE,
	JWT_KEY_FILE
    } = process.env;
    const env = {};

    return {
        async init() {

            try {
                const dbAuthPassword = processText(await readFileAsync(DB_AUTH_PASSWORD_FILE));
	        const dbPassword     = processText(await readFileAsync(DB_PASSWORD_FILE));
	        const passwordKey    = processText(await readFileAsync(PASSWORD_KEY_FILE));
	        const jwtKey         = processText(await readFileAsync(JWT_KEY_FILE));

	        env.DB_AUTH_PASSWORD = dbAuthPassword;
	        env.DB_PASSWORD      = dbPassword;
	        env.PASSWORD_KEY     = passwordKey;
	        env.JWT_KEY          = jwtKey;
            } catch (err) {
	        throw new Error('Error occured while configuring docker environment variables');
            }

        },
	env
    }
})();
