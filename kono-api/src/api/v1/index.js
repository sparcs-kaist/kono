import { Router } from 'express';
import post from './post';

export default (() => {

    const v1 = Router();

    v1.use('/post', post);

    return v1;

})();