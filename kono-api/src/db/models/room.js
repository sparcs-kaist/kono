import { createModel } from '../lib/model';

export default createModel('room', [
    {
        key: 'sid',
        type: 'integer',
        nullable: false,
        verifier(sid) { return sid >= 0; }
    },
    {
      key: 'room_number',
      type: 'integer',
      nullable: false,
      verifier(room_number) { return room_number >= 1; }
    },
    {
        key: 'state',
        type: 'boolean',
        nullable: false
    },
    {
        key: 'timestamp',
        type: 'Date',
        nullable: false
    }
]);