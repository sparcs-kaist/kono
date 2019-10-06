import { Router } from 'express';
import * as postControl from './post.control';

export default (() => {

    const post = Router();

    post.get('/', postControl.list);
    post.get('/count', postControl.count);
    post.get('/:sid', postControl.single);

    return post;

})();