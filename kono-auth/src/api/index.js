import { Router } from 'express';
import v1 from './v1';

const versions = {
    'v1': v1
};

const api = Router();

api.use('/v1', versions['v1']);

export default api;