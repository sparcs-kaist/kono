import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import db from './db'
import { JWTMiddleware } from './lib/JWTMiddleware';

dotenv.config();

const { DEV_PORT, PROD_PORT, NODE_ENV } = process.env;
const app = express();

/* Middlewares */
app.use(cors({ credentials: true, origin: [ 'http://localhost:3000' ] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(JWTMiddleware());

/* API Routes */
app.use('/', routes());

/* Connect to database */
db.init();

const port = NODE_ENV === 'development' ? DEV_PORT : PROD_PORT;
app.listen(DEV_PORT, () => {
    console.log(`Starting kono-auth ${NODE_ENV} server listening at port ${port}`);
});
