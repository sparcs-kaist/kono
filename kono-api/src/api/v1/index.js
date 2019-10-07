import { Router } from 'express';
import post from './post';
import image from './image';

export default (() => {

    const v1 = Router();

    v1.use('/post', post);
    v1.use('/image', image);

    return v1;

})();