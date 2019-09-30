import { Router } from 'express';
import v1 from './v1';

export default (() => {

    const api = Router();

    api.use('/v1', v1);

    return api;

})();