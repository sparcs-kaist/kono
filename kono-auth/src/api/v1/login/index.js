import { Router } from 'express';
import * as loginControl from './login.control';

const login = Router();

login.post('/', loginControl.login);

export default login;