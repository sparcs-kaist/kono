import { request, expect } from 'chai';
import { apiURL } from '../../../test/common';

describe('Testing GET /api/v1/image ...', () => {

    const testGeneralCase = (query) => (done) => {
        const { max_size } = query;
        request(apiURL)
            .get('/api/v1/image')
            .query(query)
            .then(res => {

                done();
            })
            .catch(err => {
                done(err);
            });
    }

});

describe('Testing GET /api/v1/image/count ...', () => {

});