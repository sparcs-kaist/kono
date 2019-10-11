import { Router } from 'express';
import auth from './auth';
import post from './post';
import image from './image';
import room from './room';

export default (() => {

    const v1 = Router();

    v1.use('/auth', auth);
    v1.use('/post', post);
    v1.use('/image', image);
    v1.use('/room', room);

    return v1;

})();