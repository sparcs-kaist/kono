import '@babel/polyfill';

import * as chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import dotenv from 'dotenv';

dotenv.config();

/* Add plugins to chai. */
chai.use(chaiHttp);
chai.use(chaiAsPromised);

function importTest(path) {
    describe(`Running unit tests in ${path}`, () => {
        require(path);
    });
};

const {
    NODE_ENV
} = process.env;

describe(`Running tests for kono-api ${NODE_ENV} server.`, () => {

    importTest('../routes.test');
    importTest('../api/v1/post/post.test');
    importTest('../api/v1/image/image.test');
    importTest('../api/v1/room/room.test');

});