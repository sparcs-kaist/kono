import { Router } from 'express';
import * as imageControl from './image.control';

export default (() => {

    const image = Router();

    image.get('/', imageControl.list);
    image.get('/count', imageControl.count);
    image.post('/upload', imageControl.upload);

    return image;

})();