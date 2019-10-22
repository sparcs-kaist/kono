const {
    NODE_ENV,
    HOST_TEST,
    PORT_TEST,
    DB_HOST_TEST,
    DB_PORT_TEST,
    DB_USER_TEST,
    DB_DATABASE_TEST
} = process.env;

export const apiURL = `http://${HOST_TEST}:${PORT_TEST}`;
export const nodeEnv = NODE_ENV === 'development' ? 'development' : 'production';