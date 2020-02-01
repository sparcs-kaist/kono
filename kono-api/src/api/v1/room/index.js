import { Router } from 'express';
import * as roomControl from './room.control';

export default (() => {

    const room = Router();
    room.get('/recent/:room_number', roomControl.recentSingle);
    room.get('/recent', roomControl.recentList);
    room.post('/', roomControl.create);

    return room;

})();