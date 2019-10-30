import { request, expect } from 'chai';
import { db, apiURL, password } from '../../../test/common';
import { generateToken } from '../../../lib/token';

describe('Testing GET /api/v1/noti ...', () => {

    beforeEach(async () => { await db.instance('noti').del(); });
    afterEach (async () => { await db.instance('noti').del(); });

    const _notis = Object.keys([...Array(20)]).map(i => ({ noti_kr: `kr${i}`, noti_en: `en${i}` }));

    const testSimple = (query) => async () => {

        await db.instance('noti').insert(_notis);

        const { max_size } = query;
        const res = await request(apiURL).get('/api/v1/noti').query(query);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf.most(max_size);
        res.body.forEach(noti => {
            expect(noti).to.have.keys(['sid', 'noti_kr', 'noti_en', 'created_time']);
            const { sid, noti_kr, noti_en, created_time } = noti;
            expect(sid).to.be.a('number');
            expect(sid).to.be.least(0);
            expect(noti_kr).to.be.a('string');
            expect(noti_en).to.be.a('string');
            expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));
        });

    }

    const testSorted = (query) => async () => {

        for (let i = 0; i < 20; i++) {
            await db.instance('noti').insert(_notis[i]);
        }

        const res = await request(apiURL).get('/api/v1/noti').query(query);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        const created_times = res.body.map(e => e.created_time);
        expect(created_times).to.satisfy(arr => arr.slice(1).every((item, idx) => arr[idx] >= item));

    }

    const testUpdate = () => async () => {

        let res;

        res = await request(apiURL).get('/api/v1/noti').query({ max_size: 5 });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(0);

        await db.instance('noti').insert(_notis.slice(0, 2));

        res = await request(apiURL).get('/api/v1/noti').query({ max_size: 5 });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(2);
        expect(res.body[0].noti_kr).to.equal('kr1');
        expect(res.body[1].noti_en).to.equal('en0');

        await db.instance('noti').insert(_notis.slice(2, 8));

        res = await request(apiURL).get('/api/v1/noti').query({ max_size: 3 });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(3);
        expect(res.body[0].noti_kr).to.equal('kr7');
        expect(res.body[1].noti_en).to.equal('en6');
        expect(res.body[2].noti_en).to.equal('en5');

        res = await request(apiURL).get('/api/v1/noti').query({ max_size: 6 });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(6);
        expect(res.body[0].noti_kr).to.equal('kr7');
        expect(res.body[1].noti_en).to.equal('en6');
        expect(res.body[2].noti_en).to.equal('en5');
        expect(res.body[4].noti_en).to.equal('en3');
        expect(res.body[5].noti_en).to.equal('en2');

        await db.instance('noti').insert(_notis.slice(8, 20));

        res = await request(apiURL).get('/api/v1/noti').query({ max_size: 5 });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(5);
        expect(res.body[0].noti_kr).to.equal('kr19');
        expect(res.body[3].noti_en).to.equal('en16');

    }

    const testInvalidQuery = (query, invalidQuery) => (done) => {
        request(apiURL)
            .get('/api/v1/noti')
            .query(query)
            .then(res => {
                expect(res).status(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal(`invalid ${invalidQuery}`);
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    describe('Simple cases.', () => {
        it('Test case 1', testSimple({
            max_size: 1
        }));
        it('Test case 2', testSimple({
            max_size: 5
        }));
        it('Test case 3', testSimple({
            max_size: 10
        }));
    });

    describe('Complex cases.', () => {
        it('Sort test 1', testSorted({
            max_size: 5
        }));
        it('Sort test 2', testSorted({
            max_size: 10
        }));
        it('Update test', testUpdate());
    });

    describe('Error handling.', () => {
        it('Invalid query "max_size" (below 0)', testInvalidQuery({
            max_size: -1
        }, 'max_size'));
        it('Invalid query "max_size" (over 64)', testInvalidQuery({
            max_size: 65
        }, 'max_size'));
    });

});

describe('Testing POST /api/v1/noti ...', () => {

    beforeEach(async () => { await db.instance('noti').del(); });
    afterEach (async () => { await db.instance('noti').del(); });

    const testSimple = (body) => async () => {

        const token = await generateToken({ sid: 0 });

        const res = await request(apiURL)
            .post('/api/v1/noti')
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify(body));

        expect(res).to.have.status(201);
        expect(res.body).to.have.keys([ 'sid', 'noti_kr', 'noti_en', 'created_time' ]);
        const { sid, noti_kr, noti_en, created_time } = res.body;
        expect(noti_kr).to.equal(body.noti_kr ? body.noti_kr : null);
        expect(noti_en).to.equal(body.noti_en ? body.noti_en : null);
        expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));

        const [rawRes] = await db.instance
            .select('*')
            .from('noti')
            .where({ deleted: 0 })
            .orderBy('created_time', 'desc')
            .limit(1);

        expect(sid).to.equal(rawRes.sid);

    }

    const testInvalidQuery = (body, invalidField) => async () => {

        const token = await generateToken({ sid: 0 });

        const res = await request(apiURL)
            .post('/api/v1/noti')
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify(body));
        
        expect(res).to.have.status(400);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal(`invalid ${invalidField}`);

    };

    const testForbidden = (body) => async () => {

        const res = await request(apiURL)
            .post('/api/v1/noti')
            .set('content-type', 'application/json')
            .send(JSON.stringify(body));

        expect(res).to.have.status(403);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal('login required');

    }

    describe('Simple cases.', () => {
        it('Test case 1', testSimple({
            noti_kr: '테스트1',
            noti_en: 'test1'
        }))
        it('Test case 2', testSimple({
            noti_kr: '테스트2'
        }))
    });

    describe('Error handling.', () => {
        it('Invalid field "noti_kr"', testInvalidQuery({
            noti_kr: 'ㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇ',
            noti_en: 'test'
        }, 'noti_kr'));
        it('Invalid field "noti_en"', testInvalidQuery({
            noti_kr: '테스트',
            noti_en: 'blablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablabla'
        }, 'noti_en'));
        it('Not logged', testForbidden({
            noti_kr: '로그인 안 한 상태',
            noti_en: 'I\'m not logged in!'
        }));
    });
    
});

describe('Testing PUT /api/v1/noti/:sid', () => {

    beforeEach(async () => { await db.instance('noti').del(); });
    afterEach (async () => { await db.instance('noti').del(); });

    const testSingleUpdate = () => async () => {

        const token = await generateToken({ sid: 0 });

        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트', noti_en: 'test' });

        const res = await request(apiURL)
            .put('/api/v1/noti/1')
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify({ noti_kr: '테스트2', noti_en: 'test2' }));

        expect(res).to.have.status(200);
        expect(res.body).to.have.keys([ 'sid', 'noti_kr', 'noti_en', 'created_time' ]);
        const { sid, noti_kr, noti_en, created_time } = res.body;
        expect(sid).to.equal(1);
        expect(noti_kr).to.equal('테스트2');
        expect(noti_en).to.equal('test2');
        expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));

        const [updatedNoti] = await db.instance.select('*').from('noti').where({ sid: 1 });
        expect(updatedNoti.noti_kr).to.equal('테스트2');
        expect(updatedNoti.noti_en).to.equal('test2');

    };

    const testMultipleUpdate = () => async () => {

        const token = await generateToken({ sid: 0 });

        /* Put a noti of sid 1~3. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });
        await db.instance('noti').insert({ sid: 2, noti_kr: '테스트2', noti_en: 'test2' });
        await db.instance('noti').insert({ sid: 3, noti_kr: '테스트3', noti_en: 'test3' });
        
        const res1 = await request(apiURL)
            .put('/api/v1/noti/1')
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify({ noti_kr: '흠...', noti_en: 'hmm...' }));

        const res2 = await request(apiURL)
            .put('/api/v1/noti/2')
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify({ noti_kr: '잘됐을까?', noti_en: 'was it done well?' }));

        const res3 = await request(apiURL)
            .put('/api/v1/noti/3')
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify({ noti_kr: '정말?', noti_en: 'please?' }));

        expect(res1).to.have.status(200);
        expect(res1.body).to.have.keys([ 'sid', 'noti_kr', 'noti_en', 'created_time' ]);
        expect(res1.body.sid).to.equal(1);
        expect(res1.body.noti_kr).to.equal('흠...');
        expect(res1.body.noti_en).to.equal('hmm...');

        expect(res2).to.have.status(200);
        expect(res2.body).to.have.keys([ 'sid', 'noti_kr', 'noti_en', 'created_time' ]);
        expect(res2.body.sid).to.equal(2);
        expect(res2.body.noti_kr).to.equal('잘됐을까?');
        expect(res2.body.noti_en).to.equal('was it done well?');

        expect(res3).to.have.status(200);
        expect(res3.body).to.have.keys([ 'sid', 'noti_kr', 'noti_en', 'created_time' ]);
        expect(res3.body.sid).to.equal(3);
        expect(res3.body.noti_kr).to.equal('정말?');
        expect(res3.body.noti_en).to.equal('please?');

        const notis = await db.instance
            .select('*')
            .from('noti')
            .orderBy([ 
                {
                    column: 'created_time', 
                    order: 'desc'
                },
                {
                    column: 'sid', 
                    order: 'desc'
                }
            ]);
        expect(notis[0].sid).to.equal(3);
        expect(notis[0].noti_kr).to.equal('정말?');
        expect(notis[0].noti_en).to.equal('please?');
        expect(notis[1].sid).to.equal(2);
        expect(notis[1].noti_kr).to.equal('잘됐을까?');
        expect(notis[1].noti_en).to.equal('was it done well?');
        expect(notis[2].sid).to.equal(1);
        expect(notis[2].noti_kr).to.equal('흠...');
        expect(notis[2].noti_en).to.equal('hmm...');

    };

    const testInvalidQuery = (sid, body, invalidField) => async () => {

        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });

        const token = await generateToken({ sid: 0 });

        const res = await request(apiURL)
            .put(`/api/v1/noti/${sid}`)
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify(body));

        expect(res).to.have.status(400);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal(`invalid ${invalidField}`);

    };

    const testNonExistent = (sid, body) => async () => {

        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });

        const token = await generateToken({ sid: 0 });

        const res = await request(apiURL)
            .put(`/api/v1/noti/${sid}`)
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify(body));

        expect(res).to.have.status(404);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal(`noti does not exist`);

    }

    const testForbidden = (sid, body) => async () => {

        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });

        const res = await request(apiURL)
            .put(`/api/v1/noti/${sid}`)
            .set('content-type', 'application/json')
            .send(JSON.stringify(body));

        expect(res).to.have.status(403);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal('login required');

    }

    it('Single update test.', testSingleUpdate());
    it('Multiple update test.', testMultipleUpdate());
    describe('Error handling tests.', () => {

        it('Invalid field "noti_kr"', testInvalidQuery(1, {
            noti_kr: 'ㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇㅅㅇ',
            noti_en: 'test'
        }, 'noti_kr'));
        it('Invalid field "noti_en"', testInvalidQuery(1, {
            noti_kr: '테스트',
            noti_en: 'blablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablablabla'
        }, 'noti_en'));
        it('Not logged', testForbidden(1, {
            noti_kr: '로그인 안 한 상태',
            noti_en: 'I\'m not logged in!'
        }));
        it('Invalid parameter "sid" (nonexistent)', testNonExistent(2, {
            noti_kr: '테스트',
            noti_en: 'test'
        }));
        it('Invalid parameter "sid" (negative)', testInvalidQuery(-1, {
            noti_kr: '테스트',
            noti_en: 'test'
        }, 'sid'));
        
    });

});

describe('Testing DELETE /api/v1/noti/:sid ...', () => {

    beforeEach(async () => { await db.instance('noti').del(); });
    afterEach (async () => { await db.instance('noti').del(); });

    const testSingleDelete = () => async () => {

        const token = await generateToken({ sid: 0 });

        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트', noti_en: 'test' });

        const res = await request(apiURL)
            .delete(`/api/v1/noti/1`)
            .set('Cookie', `access_token=${token}`);

        expect(res).to.have.status(204);

        const select = await db.instance.select('*').from('noti');
        expect(select).to.have.lengthOf(0);

    };

    const testMultipleDelete = () => async () => {

        const token = await generateToken({ sid: 0 });

        /* Put a noti of sid 1~3. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });
        await db.instance('noti').insert({ sid: 2, noti_kr: '테스트2', noti_en: 'test2' });
        await db.instance('noti').insert({ sid: 3, noti_kr: '테스트3', noti_en: 'test3' });

        const res1 = await request(apiURL)
            .delete(`/api/v1/noti/1`)
            .set('Cookie', `access_token=${token}`);
        
        expect(res1).to.have.status(204);

        const res3 = await request(apiURL)
            .delete(`/api/v1/noti/3`)
            .set('Cookie', `access_token=${token}`);
        
        expect(res3).to.have.status(204);

        const select = await db.instance.select('*').from('noti');
        expect(select).to.have.lengthOf(1);
        const [noti] = select;
        const { sid } = noti;
        expect(sid).to.equal(2);

    };

    const testInvalidQuery = (sid, invalidField) => async () => {

        const token = await generateToken({ sid: 0 });

        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });

        const res = await request(apiURL)
            .delete(`/api/v1/noti/${sid}`)
            .set('Cookie', `access_token=${token}`);

        expect(res).to.have.status(400);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal(`invalid ${invalidField}`);

    };

    const testNonExistent = (sid, body) => async () => {

        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });

        const token = await generateToken({ sid: 0 });

        const res = await request(apiURL)
            .delete(`/api/v1/noti/${sid}`)
            .set('Cookie', `access_token=${token}`)

        expect(res).to.have.status(404);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal(`noti does not exist`);

    }

    const testForbidden = (sid) => async () => {

        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });

        const res = await request(apiURL)
            .delete(`/api/v1/noti/${sid}`);

        expect(res).to.have.status(403);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal('login required');

    };

    it('Single delete test.', testSingleDelete());
    it('Multiple delete test.', testMultipleDelete());
    describe('Error handling tests.', () => {

        it('Not logged', testForbidden(1));
        it('Invalid parameter "sid" (nonexistent)', testNonExistent(2));
        it('Invalid parameter "sid" (negative)', testInvalidQuery(-1, 'sid'));
        
    });

});

describe('Integrated test.', () => {

    before(async () => { await db.instance('noti').del(); })
    after (async () => { await db.instance('noti').del(); })

    let sid1, sid2, token;

    it('POST /api/v1/auth/login', async () => {
        const res = await request(apiURL).post('/api/v1/auth/login')
            .set('content-type', 'application/json')
            .send(JSON.stringify({
                password: 'inhibitor'
            }));
        expect(res).to.have.status(200);
        expect(res.body.msg).to.equal('login success');
        token = res.header['set-cookie'][0].split(';').filter(str => str.includes('access_token'))[0].split('=')[1];
    });

    it('GET /api/v1/noti', async () => {
        const res = await request(apiURL).get('/api/v1/noti').query({ max_size: 8 });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(0);
    });

    it('POST /api/v1/noti', async () => {
        const res = await request(apiURL).post('/api/v1/noti')
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify({
                noti_kr: '현재 지폐교환기 사용이 불가합니다.', 
                noti_en: 'Bill exchanger not available at the moment.'
            }));
        expect(res).to.have.status(201);
        expect(res.body).to.have.keys([ 'sid', 'noti_kr', 'noti_en', 'created_time' ]);
        const { noti_kr, noti_en, created_time } = res.body;
        sid1 = res.body.sid;
        expect(noti_kr).to.equal('현재 지폐교환기 사용이 불가합니다.');
        expect(noti_en).to.equal('Bill exchanger not available at the moment.');
        expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));
    });

    it('GET /api/v1/noti', async () => {
        const res = await request(apiURL).get('/api/v1/noti').query({ max_size: 8 });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0].sid).to.equal(sid1);
        expect(res.body[0].noti_kr).to.equal('현재 지폐교환기 사용이 불가합니다.');
        expect(res.body[0].noti_en).to.equal('Bill exchanger not available at the moment.');
    });

    it('POST /api/v1/noti', async () => {
        const res = await request(apiURL).post('/api/v1/noti')
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify({
                noti_kr: '현재 모바일 페이지에서 잘 작동하지 않습니다.', 
                noti_en: 'Mobile page not available.'
            }));
        expect(res).to.have.status(201);
        expect(res.body).to.have.keys([ 'sid', 'noti_kr', 'noti_en', 'created_time' ]);
        const { noti_kr, noti_en, created_time } = res.body;
        sid2 = res.body.sid;
        expect(noti_kr).to.equal('현재 모바일 페이지에서 잘 작동하지 않습니다.');
        expect(noti_en).to.equal('Mobile page not available.');
        expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));
    });

    it('PUT /api/v1/noti/:sid', async () => {
        const res = await request(apiURL).put(`/api/v1/noti/${sid1}`)
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify({
                noti_kr: '현재 지폐교환기 사용이 불가능합니다.'
            }));
        expect(res).to.have.status(200);
        expect(res.body.sid).to.equal(sid1);
        expect(res.body.noti_kr).to.equal('현재 지폐교환기 사용이 불가능합니다.');
        expect(res.body.noti_en).to.equal('Bill exchanger not available at the moment.');
    });

    it('GET /api/v1/noti', async () => {
        const res = await request(apiURL).get('/api/v1/noti').query({ max_size: 8 });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(2);
        expect(res.body[0].sid).to.equal(sid2);
        expect(res.body[0].noti_kr).to.equal('현재 모바일 페이지에서 잘 작동하지 않습니다.');
        expect(res.body[0].noti_en).to.equal('Mobile page not available.');
        expect(res.body[1].sid).to.equal(sid1);
        expect(res.body[1].noti_kr).to.equal('현재 지폐교환기 사용이 불가능합니다.');
        expect(res.body[1].noti_en).to.equal('Bill exchanger not available at the moment.');
    });

    it('DELETE /api/v1/noti/:sid', async () => {
        const res = await request(apiURL).delete(`/api/v1/noti/${sid2}`)
            .set('Cookie', `access_token=${token}`);
        expect(res).to.have.status(204);
    });

    it('GET /api/v1/noti', async () => {
        const res = await request(apiURL).get('/api/v1/noti').query({ max_size: 8 });
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(1);
        expect(res.body[0].sid).to.equal(sid1);
        expect(res.body[0].noti_kr).to.equal('현재 지폐교환기 사용이 불가능합니다.');
        expect(res.body[0].noti_en).to.equal('Bill exchanger not available at the moment.');
    });

});