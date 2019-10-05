import { request, expect } from 'chai';
import { apiURL } from '../../../test/common';

describe('Testing GET /api/v1/post ...', () => {

    it('General case 1', (done) => {

        request(apiURL)
            .get('/api/v1/post')
            .query({
                filter_type: 'notice',
                start_index: 0,
                max_size: 5
            })
            .then(res => {
                expect(res).status(200);
                expect(res.body).to.have.keys(['size', 'posts']);
                const { size, posts } = res.body;
                expect(size).to.be.a('number');
                expect(size).to.be.least(0);
                expect(posts).to.be.a('array');
                expect(posts).to.have.lengthOf.most(5);
                posts.forEach(post => {
                    expect(post).to.have.keys(['sid', 'title_kr', 'title_en', 'created_time', 'type']);
                    const { sid, type, title_kr, title_en, created_time } = post;
                    expect(sid).to.be.a('number');
                    expect(sid).to.be.least(0);
                    expect(type).to.equal('notice');
                    expect(title_kr).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(title_en).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));
                });
                done();
            })
            .catch(err => {
                done(err);
            });

    });

    it('General case 2', (done) => {

        request(apiURL)
            .get('/api/v1/post')
            .query({
                start_index: 0,
                max_size: 2
            })
            .then(res => {
                expect(res).status(200);
                expect(res.body).to.have.keys(['size', 'posts']);
                const { size, posts } = res.body;
                expect(size).to.be.a('number');
                expect(size).to.be.least(0);
                expect(posts).to.be.a('array');
                expect(posts).to.have.lengthOf.most(2);
                posts.forEach(post => {
                    expect(post).to.have.keys(['sid', 'title_kr', 'title_en', 'created_time', 'type']);
                    const { sid, type, title_kr, title_en, created_time } = post;
                    expect(sid).to.be.a('number');
                    expect(sid).to.be.least(0);
                    expect(type).to.be.oneOf(['notice', 'lostfound']);
                    expect(title_kr).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(title_en).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));
                });
                done();
            })
            .catch(err => {
                done(err);
            });

    });

    it('Invalid query "filter_type"', (done) => {

        request(apiURL)
            .get('/api/v1/post')
            .query({
                filter_type: 'foo',
                start_index: 0,
                max_size: 5
            })
            .then(res => {
                expect(res).status(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal('invalid filter_type');
                done();
            })
            .catch(err => {
                done(err);
            });

    });

    it('Invalid query "start_index"', (done) => {

        request(apiURL)
            .get('/api/v1/post')
            .query({
                filter_type: 'notice',
                start_index: -5,
                max_size: 5
            })
            .then(res => {
                expect(res).status(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal('invalid start_index');
                done();
            })
            .catch(err => {
                done(err);
            });

    });

    it('Invalid query "max_size" (below 0)', (done) => {

        request(apiURL)
            .get('/api/v1/post')
            .query({
                filter_type: 'notice',
                start_index: 0,
                max_size: -3
            })
            .then(res => {
                expect(res).status(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal('invalid max_size');
                done();
            })
            .catch(err => {
                done(err);
            });

    });

    it('Invalid query "max_size" (over 64)', (done) => {

        request(apiURL)
            .get('/api/v1/post')
            .query({
                filter_type: 'notice',
                start_index: 0,
                max_size: 237
            })
            .then(res => {
                expect(res).status(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal('invalid max_size');
                done();
            })
            .catch(err => {
                done(err);
            });

    });

    it('Missing query "max_size"', (done) => {

        request(apiURL)
            .get('/api/v1/post')
            .query({
                filter_type: 'notice',
                start_index: 0
            })
            .then(res => {
                expect(res).status(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal('max_size required');
                done();
            })
            .catch(err => {
                done(err);
            });

    });

});