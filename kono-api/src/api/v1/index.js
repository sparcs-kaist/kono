import { Router } from 'express';
import auth from './auth';
import post from './post';
import image from './image';
import room from './room';
import noti from './noti';

export default (() => {

    const v1 = Router();

    v1.use('/auth', auth);
    v1.use('/post', post);
    v1.use('/image', image);
    v1.use('/room', room);
    v1.use('/noti', noti);

    return v1;

})();