import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes';
import db from './db'
import { JWTMiddleware } from './lib/JWTMiddleware';

dotenv.config();

const { DEV_PORT } = process.env;
const app = express();

/* Middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(JWTMiddleware());

/* API Routes */
app.use('/', routes());

/* Connect to database */
db.init();

app.listen(DEV_PORT, () => {
    console.log(`kono-auth server listening at port ${DEV_PORT}`);
});
