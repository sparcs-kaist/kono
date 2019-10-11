const {
    DEV_HOST,
    PROD_HOST,
    DEV_PORT,
    PROD_PORT,
    NODE_ENV
} = process.env;

export const nodeEnv = NODE_ENV;
export const host = NODE_ENV === 'production' ? 
    PROD_HOST : 
    DEV_HOST;
export const port = NODE_ENV === 'production' ? 
    PROD_PORT : 
    DEV_PORT;
export const apiURL = `http://${host}:${port}`;