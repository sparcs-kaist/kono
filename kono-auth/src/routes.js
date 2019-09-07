import { Router } from 'express';
import api from './api';

export default () => {
    const routes = Router();
    routes.get('/', (req, res) => res.end('kono-auth development server'));
    routes.use('/api', api);
    return routes;
}
