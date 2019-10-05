import { request, assert } from 'chai';
import { apiURL, nodeEnv } from './test/common';

describe('Testing GET / ...', () => {

    it('Server is alive and responding', (done) => {
        request(apiURL)
            .get('/')
            .then(res => {
                assert.equal(res.status, 200);
                assert.equal(res.text, `kono-api ${nodeEnv} server`);
                done();
            })
            .catch(err => {
                done(err);
            })
    });

});