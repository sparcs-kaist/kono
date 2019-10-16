import { Router } from 'express';
import api from './api';

export default (() => {
    const routes = Router();
    
    routes.use('/api', api);
    
    return routes;
})();
