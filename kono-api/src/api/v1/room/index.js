import { Router } from 'express';
import * as roomControl from './room.control';

export default (() => {

    const room = Router();
    room.get('/recent/:room_number', roomControl.recent);

    return room;

})();