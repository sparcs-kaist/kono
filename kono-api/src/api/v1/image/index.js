import { Router } from 'express';
import * as imageControl from './image.control';

export default (() => {

    const image = Router();

    image.get('/', imageControl.list);

    return image;

})();