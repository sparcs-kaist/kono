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