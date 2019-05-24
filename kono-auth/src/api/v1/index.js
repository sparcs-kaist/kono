import { Router } from 'express';
import login from './login';

const v1 = Router();

v1.use('/login', login);

export default v1;