import { request, expect } from 'chai';
import { apiURL } from '../../../test/common';

describe('Testing GET /api/v1/post ...', () => {

    const testGeneralCase = (query) => (done) => {
        const { max_size } = query;
        request(apiURL)
            .get('/api/v1/post')
            .query(query)
            .then(res => {
                expect(res).status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.most(max_size);
                res.body.forEach(post => {
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
    };

    const testFilter = (query) => (done) => {
        const { filter_type, max_size } = query;
        request(apiURL)
            .get('/api/v1/post')
            .query(query)
            .then(res => {
                expect(res).status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.most(max_size);
                res.body.forEach(post => {
                    expect(post).to.have.keys(['sid', 'title_kr', 'title_en', 'created_time', 'type']);
                    const { sid, type, title_kr, title_en, created_time } = post;
                    expect(sid).to.be.a('number');
                    expect(sid).to.be.least(0);
                    expect(type).to.equal(filter_type);
                    expect(title_kr).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(title_en).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));
                });
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    const testInvalidQuery = (query, invalidQuery) => (done) => {
        request(apiURL)
            .get('/api/v1/post')
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

    const testRequiredQuery = (query, requiredQuery) => (done) => {
        request(apiURL)
            .get('/api/v1/post')
            .query(query)
            .then(res => {
                expect(res).status(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal(`${requiredQuery} required`);
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    describe('General cases.', () => {
        it('Test case 1', testGeneralCase({
            start_index: 0,
            max_size: 5
        }));
        it('Test case 2', testGeneralCase({
            max_size: 2
        }));
        it('Test case 3', testGeneralCase({
            max_size: 6
        }));
    });

    describe('Testing filter_type.', () => {
        it('Filter by notice', testFilter({
            filter_type: 'notice',
            max_size: 64
        }));
        it('Filter by lostfound', testFilter({
            filter_type: 'lostfound',
            max_size: 64
        }));
    });

    describe('Error handling.', () => {
        it('Invalid query "filter_type"', testInvalidQuery({
            filter_type: 'foo',
            start_index: 0,
            max_size: 64
        }, 'filter_type'));
        it('Invalid query "start_index"', testInvalidQuery({
            filter_type: 'lostfound',
            start_index: -5,
            max_size: 64
        }, 'start_index'));
        it('Invalid query "max_size" (below 0)', testInvalidQuery({
            filter_type: 'notice',
            start_index: 3,
            max_size: -1
        }, 'max_size'));
        it('Invalid query "max_size" (over 64)', testInvalidQuery({
            filter_type: 'notice',
            start_index: 3,
            max_size: 65
        }, 'max_size')); 
        it('Missing query "max_size"', testRequiredQuery({
            filter_type: 'lostfound',
            start_index: 1
        }, 'max_size'));
    });

});

describe('Testing GET /api/v1/post/:sid ...', () => {

    const testGeneralCase = (sid) => (done) => {
        request(apiURL)
            .get(`/api/v1/post/${sid}`)
            .then(res => {
                expect(res.status).to.be.oneOf([200, 404]);
                if (res.status === 200) {
                    expect(res.body).to.have.keys(['sid', 'type', 'title_kr', 'title_en', 'created_time', 'content_kr', 'content_en', 'content_img']);
                    const { sid, type, title_kr, title_en, created_time, content_kr, content_en, content_img } = res.body;
                    expect(sid).to.equal(sid);
                    expect(type).to.be.oneOf(['notice', 'lostfound']);
                    expect(title_kr).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(title_en).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(created_time).to.satisfy(e => !isNaN(Date.parse(e)));
                    expect(content_kr).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(content_en).to.satisfy(e => (e === null) || (typeof e === 'string'));
                    expect(content_img).to.be.a('array');
                    content_img.forEach(img => {
                        expect(img).to.be.a('string');
                    });
                }
                else if (res.status === 404) {
                    expect(res.body).to.have.key('msg');
                    expect(res.body.msg).to.equal('post does not exist');
                }
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    const testInvalidSID = (sid) => (done) => {
        request(apiURL)
            .get(`/api/v1/post/${sid}`)
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal('invalid sid');
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
        it('Test case 4', testGeneralCase(16));
    });

    describe('Error handling.', () => {
        it('Invalid sid (-5)', testInvalidSID(-5));
    });

});

describe('Testing GET /api/v1/post/count ...', () => {

    const testGeneralCase = () => (done) => {
        request(apiURL)
            .get('/api/v1/post/count')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.keys(['notice', 'lostfound']);
                expect(res.body.notice).to.be.a('number');
                expect(res.body.notice).to.be.at.least(0);
                expect(res.body.lostfound).to.be.a('number');
                expect(res.body.lostfound).to.be.at.least(0);
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