import { assert } from 'chai';
import dotenv from 'dotenv';

dotenv.config();

function importTest(path) {
    describe(`Running unit tests in ${path}`, () => {
        require(path);
    });
};

const {
    NODE_ENV
} = process.env;

describe(`Running tests for kono-api ${NODE_ENV} server.`, () => {

    it('This test environment is not broken.', (done) => {
        assert.equal(true, true, 'true should equal true');
        done();
    })

});