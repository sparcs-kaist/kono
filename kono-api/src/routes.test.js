import { request, assert } from 'chai';
import { apiURL } from './test/common';

describe('Testing GET /api ...', () => {

    it('Server is alive and responding', (done) => {
        request(apiURL)
            .get('/api')
            .then(res => {
                assert.equal(res.status, 200);
                done();
            })
            .catch(err => {
                done(err);
            })
    });

});
