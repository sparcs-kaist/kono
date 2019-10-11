import '@babel/polyfill';

import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes';
import db from './db';
import JWTMiddleware from './lib/JWTMiddleware';

dotenv.config();
const { NODE_ENV, DEV_PORT, PROD_PORT } = process.env;

const app = express();

app.use((req, res, next) => {
    const whitelist = ['localhost'];
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

db.init();

const port = NODE_ENV === 'production' ? PROD_PORT : DEV_PORT;
app.listen(port, () => {
    console.log(`Starting kono-api ${NODE_ENV} server listening at port ${port}`);
});
