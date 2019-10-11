import { Router } from 'express';
import * as authControl from './auth.control';

export default (() => {

    const auth = Router();

    auth.post('/login', authControl.login);
    auth.get('/check', authControl.check);
    auth.post('/logout', authControl.logout);
    auth.put('/password', authControl.updatePassword);

    return auth;

})();