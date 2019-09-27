import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

dotenv.config();
const { NODE_ENV, DEV_PORT, PROD_PORT } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

const port = NODE_ENV === 'production' ? PROD_PORT : DEV_PORT;
app.listen(port, () => {
    console.log(`Starting kono-api ${NODE_ENV} server listening at port ${port}`);
});