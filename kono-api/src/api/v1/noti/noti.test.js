import { request, expect } from 'chai';
import { db, apiURL, password } from '../../../test/common';
import { generateToken } from '../../../lib/token';

describe('Testing GET /api/v1/noti ...', () => {

    const testSimple = (query) => async () => {
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

        /* Clean table */
        await db.instance('noti').del();

        const _notis = Object.keys([...Array(20)]).map(i => ({ noti_kr: `kr${i}`, noti_en: `en${i}` }));

        for (let i = 0; i < 20; i++) {
            await db.instance('noti').insert(_notis[i]);
        }

        const res = await request(apiURL).get('/api/v1/noti').query(query);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        const created_times = res.body.map(e => e.created_time);
        expect(created_times).to.satisfy(arr => arr.slice(1).every((item, idx) => arr[idx] >= item));

        /* Clean table */
        await db.instance('noti').del();

    }

    const testUpdate = () => async () => {

        let res;
        const _notis = Object.keys([...Array(20)]).map(i => ({ noti_kr: `kr${i}`, noti_en: `en${i}` }));

        /* Clean table */
        await db.instance('noti').del();

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

        /* Clean table */
        await db.instance('noti').del();

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

    const testSimple = (body) => async () => {

        const token = await generateToken({ sid: 0 });

        const res = await request(apiURL)
            .post('/api/v1/noti')
            .set('content-type', 'application/json')
            .set('Cookie', `access_token=${token}`)
            .send(JSON.stringify(body));

        expect(res).to.have.status(200);
        expect(res.body).to.have.keys([ 'sid', 'noti_kr', 'noti_en', 'created_time' ]);
        const { sid, noti_kr, noti_en, created_time } = res.body;
        expect(noti_kr).to.equal(body.noti_kr);
        expect(noti_en).to.equal(body.noti_en);
        expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));

        const rawRes = await db.instance
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
            noti_kr: '테스트',
            noti_en: 'test'
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
        }));
        it('Not logged', testForbidden({
            noti_kr: '로그인 안 한 상태',
            noti_en: 'I\'m not logged in!'
        }));
    });
    
});

describe('Testing PUT /api/v1/noti/:sid', () => {

    const testSingleUpdate = () => async () => {

        const token = await generateToken({ sid: 0 });

        /* Clean table. */
        await db.instance('noti').del();
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

        /* Clean table. */
        await db.instance('noti').del();

    };

    const testMultipleUpdate = () => async () => {

        const token = await generateToken({ sid: 0 });

        /* Clean table. */
        await db.instance('noti').del();
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

        const notis = await db.instance.select('*').from('noti');
        expect(notis[0].sid).to.equal(3);
        expect(notis[0].noti_kr).to.equal('정말?');
        expect(notis[0].noti_en).to.equal('please?');
        expect(notis[1].sid).to.equal(2);
        expect(notis[1].noti_kr).to.equal('잘됐을까?');
        expect(notis[1].noti_en).to.equal('was it done well?');
        expect(notis[2].sid).to.equal(1);
        expect(notis[2].noti_kr).to.equal('흠...');
        expect(notis[2].noti_en).to.equal('hmm...');

        /* Clean table. */
        await db.instance('noti').del();

    };

    const testInvalidQuery = (sid, body, invalidField) => async () => {

        /* Clean table. */
        await db.instance('noti').del();
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

        /* Clean table. */
        await db.instance('noti').del();

    };

    const testForbidden = (sid, body) => async () => {

        /* Clean table. */
        await db.instance('noti').del();
        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });

        const res = await request(apiURL)
            .put(`/api/v1/noti/${sid}`)
            .set('content-type', 'application/json')
            .send(JSON.stringify(body));

        expect(res).to.have.status(403);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal('login required');

        /* Clean table. */
        await db.instance('noti').del();

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
        }));
        it('Not logged', testForbidden(1, {
            noti_kr: '로그인 안 한 상태',
            noti_en: 'I\'m not logged in!'
        }));
        it('Invalid parameter "sid" (nonexistent)', testInvalidQuery(2, {
            noti_kr: '테스트',
            noti_en: 'test'
        }));
        it('Invalid parameter "sid" (negative)', testInvalidQuery(-1, {
            noti_kr: '테스트',
            noti_en: 'test'
        }));
        
    });

});

describe('Testing DELETE /api/v1/noti/:sid ...', () => {

    const testSingleDelete = () => async () => {

        const token = await generateToken({ sid: 0 });

        /* Clean table. */
        await db.instance('noti').del();
        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트', noti_en: 'test' });

        const res = await request(apiURL)
            .delete(`/api/v1/noti/1`);

        expect(res).to.have.status(204);

        const select = await db.instance.select('*').from('noti');
        expect(select).to.have.lengthOf(0);

        /* Clean table. */
        await db.instance('noti').del();

    };

    const testMultipleDelete = () => async () => {

        const token = await generateToken({ sid: 0 });

        /* Clean table. */
        await db.instance('noti').del();
        /* Put a noti of sid 1~3. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });
        await db.instance('noti').insert({ sid: 2, noti_kr: '테스트2', noti_en: 'test2' });
        await db.instance('noti').insert({ sid: 3, noti_kr: '테스트3', noti_en: 'test3' });

        const res1 = await request(apiURL)
            .delete(`/api/v1/noti/1`);
        
        expect(res1).to.have.status(204);

        const res3 = await request(apiURL)
            .delete(`/api/v1/noti/3`);
        
        expect(res3).to.have.status(204);

        const select = await db.instance.select('*').from('noti');
        expect(select).to.have.lengthOf(0);
        const [noti] = select;
        const { sid } = noti;
        expect(sid).to.equal(2);

        /* Clean table. */
        await db.instance('noti').del();

    };

    const testInvalidQuery = (sid) => async () => {

        const token = await generateToken({ sid: 0 });

        /* Clean table. */
        await db.instance('noti').del();
        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });

        const res = await request(apiURL)
            .delete(`/api/v1/noti/${sid}`);

        expect(res).to.have.status(400);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal(`invalid ${invalidField}`);

        /* Clean table. */
        await db.instance('noti').del();

    };

    const testForbidden = (sid) => async () => {

        /* Clean table. */
        await db.instance('noti').del();
        /* Put a noti of sid 1. */
        await db.instance('noti').insert({ sid: 1, noti_kr: '테스트1', noti_en: 'test1' });

        const res = await request(apiURL)
            .delete(`/api/v1/noti/${sid}`);

        expect(res).to.have.status(403);
        expect(res.body).to.have.key('msg');
        expect(res.body.msg).to.equal('login required');

        /* Clean table. */
        await db.instance('noti').del();

    };

    it('Single delete test.', testSingleDelete());
    it('Multiple delete test.', testMultipleDelete());
    describe('Error handling tests.', () => {

        it('Not logged', testForbidden(1));
        it('Invalid parameter "sid" (nonexistent)', testInvalidQuery(2));
        it('Invalid parameter "sid" (negative)', testInvalidQuery(-1));
        
    });

});