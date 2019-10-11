import { Router } from 'express';
import * as authControl from './auth.control';

const login = Router();

login.post('/login',   authControl.login);
login.get ('/check',   authControl.check);
login.post('/logout',  authControl.logout);
login.put('/password', authControl.updatePassword);

export default login; 