import { Router } from 'express';
import * as loginControl from './login.control';

const login = Router();

login.use('/', loginControl.login);

export default login;