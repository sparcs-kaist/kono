import { Router } from 'express';
import api from './api';

export default (() => {
    const routes = Router();
    
    routes.get('/', (req, res) => {
        res.end(`kono-api ${process.env.NODE_ENV} server`);
    });
    routes.use('/api', api);
    
    return routes;
})();