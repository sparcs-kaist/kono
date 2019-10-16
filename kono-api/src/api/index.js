import { Router } from 'express';
import v1 from './v1';

export default (() => {

    const api = Router();

    api.get('/', (req, res) => {
	res.end(`kono-api ${process.env.NODE_ENV} server`);
    });
    api.use('/v1', v1);

    return api;

})();
