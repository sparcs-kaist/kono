import { request, expect } from 'chai';
import { db, apiURL, password } from '../../../test/common';
import { generateToken } from '../../../lib/token';

describe('Testing GET /api/v1/room/recent/:room_number ...', () => {

    before(async () => {
        await db.instance('room').del();
        await db.instance('room').insert({ room_number: 2, state: 0 });
        await db.instance('room').insert({ room_number: 7, state: 1 });
    });
    after(async () => {
        await db.instance('room').del();
    });

    const testGeneralCase = (room_number) => (done) => {
        request(apiURL)
            .get(`/api/v1/room/recent/${room_number}`)
            .then(res => {
                expect(res.status).to.be.oneOf([200, 404]);
                if (res.status === 200) {
                    expect(res.body).to.have.keys(['state', 'timestamp']);
                    const { state, timestamp } = res.body;
                    expect(state).to.be.oneOf([1, 0]);
                    expect(timestamp).to.satisfy(e => !isNaN(Date.parse(e)));
                }
                else if (res.status === 404) {
                    expect(res.body).to.have.key('msg');
                    expect(res.body.msg).to.equal('room does not exist');
                }
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    const testInvalidRoomNumber = (room_number) => (done) => {
        request(apiURL)
            .get(`/api/v1/room/recent/${room_number}`)
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal('invalid room number');
                done();
            })
            .catch(err => {
                done(err);
            });
    }

    describe('General cases.', () => {
        it('Test case 1', testGeneralCase(7));
        it('Test case 2', testGeneralCase(2));
        it('Test case 3', testGeneralCase(11));
    });

    describe('Error handling.', () => {
        it('Invalid room number (-5)', testInvalidRoomNumber(-5));
    });

});

describe('Testing GET /api/v1/room/recent ...', () => {

    before(async () => {
        await db.instance('room').del();
        await db.instance('room').insert({ room_number: 2, state: 0 });
        await db.instance('room').insert({ room_number: 7, state: 1 });
    });
    after(async () => {
        await db.instance('room').del();
    });

    const testGeneralCase = () => (done) => {
        request(apiURL)
            .get(`/api/v1/room/recent`)
            .then(res => {
                expect(res).status(200);
                expect(res.body).to.be.a('array');
                let room_numbers = [];
                res.body.forEach(room => {
                    expect(room).to.have.keys(['room_number', 'state', 'timestamp']);
                    const { room_number, state, timestamp } = room;
                    expect(room_number).to.be.a('number');
                    expect(room_number).to.be.least(1);
                    expect(state).to.be.oneOf([1, 0]);
                    expect(timestamp).to.satisfy(e => !isNaN(Date.parse(e)));
                    room_numbers.push(room_number);
                });
                // Test if all room_numbers are unique.
                room_numbers.forEach((value, index, array) => {
                    expect(array.indexOf(value) === index);
                });
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    describe('General case.', () => {
        it('Test case 1', testGeneralCase());
    });

});

describe('Testing POST /api/v1/room', () => {

    beforeEach(async () => { await db.instance('room').del(); });
    afterEach (async () => { await db.instance('room').del(); });

    const testSimple = ({ room_number, state }) => async () => {

        const token = await generateToken({ sid: 0 });

        const res = await request(apiURL)
            .post(`/api/v1/room?room_number=${room_number}&state=${state}`)
            .set('Cookie', `access_token=${token}`);

        expect(res).to.have.status(201);

        const [recentRes] = await db.instance
            .select('*')
            .from('room')
            .orderBy('timestamp', 'desc')
            .limit(1);

        expect(recentRes.room_number).to.equal(room_number);
        expect(recentRes.state).to.equal(state);

    };

    const testInvalidQuery = ({ room_number, state }, invalidField) => async () => {

        const token = await generateToken({ sid: 0 });

        const res = await request(apiURL)
            .post(`/api/v1/room?room_number=${room_number}&state=${state}`)
            .set('Cookie', `access_token=${token}`);

        expect(res).to.have.status(400);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal(`invalid ${invalidField}`);

    };

    const testForbidden = ({ room_number, state }) => async () => {

        const res = await request(apiURL)
            .post(`/api/v1/room?room_number=${room_number}&state=${state}`)

        expect(res).to.have.status(403);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal('login required');

    };

    describe('Simple cases.', () => {
        it('Test case 1', testSimple({
            room_number: 1,
            state: 0
        }));
        it('Test case 2', testSimple({
            room_number: 3,
            state: 1
        }));
        it('Test case 3', testSimple({
            room_number: 7,
            state: 1
        }));
    });

    describe('Error handling.', () => {
        it('Invalid field "room_number"', testInvalidQuery({
            room_number: 0,
            state: 0
        }, 'room_number'));
        it('Invalid field "state"', testInvalidQuery({
            room_number: 1,
            state: 2
        }, 'state'));
        it('Not logged', testForbidden({
            room_number: 3,
            state: 1
        }));
    });

});

describe('Integrated test.', () => {

    before(async () => { await db.instance('room').del(); });
    after (async () => { await db.instance('room').del(); });

    let token;

    it('POST /api/v1/auth/login', async () => {
        const res = await request(apiURL).post('/api/v1/auth/login')
            .set('content-type', 'application/json')
            .send(JSON.stringify({ password }));
        expect(res).to.have.status(200);
        expect(res.body.msg).to.equal('login success');
        token = res.header['set-cookie'][0].split(';').filter(str => str.includes('access_token'))[0].split('=')[1];
    });

    it('GET /api/v1/room/recent', async () => {
        const res = await request(apiURL).get('/api/v1/room/recent');
        expect(res).to.have.status(404);
        expect(res.body.msg).to.equal('no room data exists');
    });

    it('POST /api/v1/room', async () => {
        const RECORDS = [1, 0, 1, 1, 1, 0, 1];
        await Promise.all(RECORDS.map((state, index) => {
            return request(apiURL).post(`/api/v1/room?room_number=${index+1}&state=${state}`)
            .set('Cookie', `access_token=${token}`)
            .then(res => { expect(res).to.have.status(201); })
        }));
    });

    it('GET /api/v1/room/recent', async () => {
        const RECORDS = [1, 0, 1, 1, 1, 0, 1];
        const res = await request(apiURL).get('/api/v1/room/recent');
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(7);
        res.body.forEach(record => {
            expect(record).to.have.keys(['room_number', 'state', 'timestamp']);
            const { room_number, state } = record;
            expect(state).to.equal(RECORDS[room_number - 1]);
        })
    });

    it('POST /api/v1/room', async () => {
        const res = await request(apiURL).post(`/api/v1/room?room_number=4&state=0`)
            .set('Cookie', `access_token=${token}`)
        expect(res).to.have.status(201);
    });

    it('GET /api/v1/room/recent/:room_number', async () => {
        const res = await request(apiURL).get('/api/v1/room/recent/4');
        expect(res).to.have.status(200);
        expect(res.body).to.have.keys(['state', 'timestamp']);
        expect(res.body.state).to.equal(0);
    });

    it('GET /api/v1/room/recent', async () => {
        const RECORDS = [1, 0, 1, 0, 1, 0, 1];
        const res = await request(apiURL).get('/api/v1/room/recent');
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(7);
        res.body.forEach(record => {
            expect(record).to.have.keys(['room_number', 'state', 'timestamp']);
            const { room_number, state } = record;
            expect(state).to.equal(RECORDS[room_number - 1]);
        })
    });

});