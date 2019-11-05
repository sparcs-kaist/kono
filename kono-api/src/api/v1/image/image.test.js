import { request, expect } from 'chai';
import { apiURL } from '../../../test/common';
import fs from 'fs';
import path from 'path';

describe('Testing GET /api/v1/image ...', () => {

    const testGeneralCase = (query) => (done) => {
        const { max_size } = query;
        request(apiURL)
            .get('/api/v1/image')
            .query(query)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.most(max_size);
                res.body.forEach(image => {
                    expect(image).to.have.keys(['sid', 'url', 'post_sid']);
                    const { sid, url, post_sid } = image;
                    expect(sid).to.be.a('number');
                    expect(sid).to.be.least(0);
                    expect(url).to.be.a('string');
                    expect(post_sid).to.be.a('number');
                    expect(post_sid).to.be.least(0);
                });
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    const testExistence = (query) => (done) => {
        request(apiURL)
            .get('/api/v1/image')
            .query(query)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                Promise.all(
                    res.body.map(image => request(apiURL)
                        .get(`/api/v1/post/${image.post_sid}`)
                        .then(_res => { expect(_res, 'post attached to the image should exist').to.have.status(200); }))
                )
                .then(() => { done(); })
                .catch(() => { done(err); });
            })
            .catch(err => {
                done(err);
            });
    };

    const testSorted = (query) => (done) => {
        request(apiURL)
            .get('/api/v1/image')
            .query(query)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
               Promise.all(
                    res.body.map(image => request(apiURL)
                        .get(`/api/v1/post/${image.post_sid}`)
                        .then(_res => Date.parse(_res.body.created_time)))
                )
                .then(created_times => {
                    expect(created_times, 'created_time should be in descending order')
                        .to.satisfy(arr => arr.slice(1).every((item, idx) => arr[idx] >= item));
                    done();
                })
                .catch(err => {
                    done(err);
                });
            })
            .catch(err => {
                done(err);
            });
    };

    const testFilter = (query) => (done) => {
        const { filter_type } = query;
        request(apiURL)
            .get('/api/v1/image')
            .query(query)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                Promise.all(
                    res.body.map(image => request(apiURL)
                        .get(`/api/v1/post/${image.post_sid}`)
                        .then(_res => _res.body.type))
                )
                .then(types => {
                    types.forEach(type => {
                        expect(type).to.equal(filter_type);
                    })
                    done();
                })
                .catch(err => { done(err); });
            })
            .catch(err => {
                done(err);
            });
    }

    const testInvalidQuery = (query, invalidQuery) => (done) => {
        request(apiURL)
            .get('/api/v1/image')
            .query(query)
            .then(res => {
                expect(res).to.have.status(400);
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
            .get('/api/v1/image')
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
            max_size: 6
        }));
        it('Test case 2', testGeneralCase({
            start_index: 12,
            max_size: 6
        }));
        it('Test case 3', testGeneralCase({
            filter_type: 'notice',
            start_index: 3,
            max_size: 3
        }));
        it('Test case 4', testGeneralCase({
            filter_type: 'lostfound',
            start_index: 0,
            max_size: 6
        }));
    });
    describe('Post existence tests.', () => {
        it('Test case 1', testExistence({
            start_index: 0,
            max_size: 6
        }));
        it('Test case 2', testExistence({
            filter_type: 'notice',
            start_index: 0,
            max_size: 6
        }));
    });
    describe('Image sort test.', () => {
        it('Test case 1', testSorted({
            start_index: 0,
            max_size: 64
        }));
    });
    describe('Filter test.', () => {
        it('Filter by notice', testFilter({
            filter_type: 'notice',
            max_size: 64
        }));
        it('Filter with lostfound', testFilter({
            filter_type: 'lostfound',
            max_size: 64
        }));
    });
    describe('Error handling.', () => {
        it('Invalid query "filter_type"', testInvalidQuery({
            filter_type: 'foo',
            max_size: 64
        }, 'filter_type'));
        it('Invalid query "start_index"', testInvalidQuery({
            filter_type: 'lostfound',
            start_index: -2,
            max_size: 5
        }, 'start_index'));
        it('Invalid query "max_size" (below 0)', testInvalidQuery({
            filter_type: 'notice',
            start_index: 10,
            max_size: -1
        }, 'max_size'));
        it('Invalid query "max_size" (over 64)', testInvalidQuery({
            filter_type: 'lostfound',
            start_index: 3,
            max_size: 65
        }, 'max_size'));
        it('Missing query "max_size"', testRequiredQuery({
            filter_type: 'lostfound',
            start_index: 1
        }, 'max_size'));
    });

});

describe('Testing GET /api/v1/image/count ...', () => {

    const testGeneralCase = () => (done) => {
        request(apiURL)
            .get('/api/v1/image/count')
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

describe('Testing POST /api/v1/image/upload ...', () => {

    const testGeneralCase = () => (done) => {
        request(apiURL)
            .post('/api/v1/image/upload')
            .attach('image', fs.readFileSync(path.join(__dirname, '../../../test/testdata/test.png')), 'test.png')
            .attach('image', fs.readFileSync(path.join(__dirname, '../../../test/testdata/test.jpg')), 'test.jpg')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body).to.be.length(2);
                // For testing, the test server is an identical machine.
                res.body.forEach(path => {
                    fs.access(path, fs.F_OK, (err) => {
                        // Remove file which is uploaded to test env upload dir.
                        fs.unlinkSync(path);
                        expect(err).to.be.equal(null);
                    });
                });
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    const testUnsupportedType = () => (done) => {
        request(apiURL)
            .post('/api/v1/image/upload')
            .attach('image', fs.readFileSync(path.join(__dirname, '../../../test/testdata/test.txt')), 'test.txt')
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.key('msg');
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    const testUnexpectedField = () => (done) => {
        request(apiURL)
            .post('/api/v1/image/upload')
            .attach('asdf', fs.readFileSync(path.join(__dirname, '../../../test/testdata/test.jpg')), 'test.jpg')
            .then(res => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.key('msg');
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    describe('General case.', () => {
        it('Test case 1', testGeneralCase());
    });
    describe('Error handling.', () => {
        it('Unexpected field', testUnexpectedField());
        it('Unsupported type', testUnsupportedType());
    });

});