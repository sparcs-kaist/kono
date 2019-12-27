import '@babel/polyfill';

import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes';
import db from './db';
import JWTMiddleware from './lib/JWTMiddleware';
import dockerConfig from './lib/docker.config';

dotenv.config();
const { NODE_ENV, PORT } = process.env;

const dbConfig = async () => {
    await dockerConfig.init()
        .then(() => { db.init() });
};

/* DB initialization. */
dbConfig();

const app = express();

app.use((req, res, next) => {
    const whitelist = ['localhost', 'kono.sparcs.org', 'kono.kaist.ac.kr'];
    const origin = req.header('Origin');

    whitelist.forEach(host => {
        if (origin && origin.indexOf(host) !== -1)
            res.set('Access-Control-Allow-Origin', origin);
    });

    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-timebase, Link');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    return next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(JWTMiddleware());

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Starting kono-api ${NODE_ENV} server listening at port ${PORT}`);
});
