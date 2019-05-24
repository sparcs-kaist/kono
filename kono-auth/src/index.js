import 'babel-polyfill';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import api from './api';

dotenv.config();

const { DEV_PORT } = process.env;
const app = express();

/* Middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* API Routes */
app.use('/api', api);

app.listen(DEV_PORT, () => {
    console.log(`kono-auth server listening at port ${DEV_PORT}`);
});