import { Router } from 'express';
import * as notiControl from './noti.control';

export default (() => {

    const noti = Router();

    noti.get('/', notiControl.list);
    noti.post('/', notiControl.createNoti);
    noti.put('/:sid', notiControl.updateNoti);
    noti.delete('/:sid', notiControl.deleteNoti);

    return noti;

})();