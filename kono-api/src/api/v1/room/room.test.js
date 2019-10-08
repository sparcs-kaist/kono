import { request, expect } from 'chai';
import { apiURL } from '../../../test/common';

describe('Testing GET /api/v1/room/recent/:room_number ...', () => {

    const testGeneralCase = (room_number) => (done) => {
        request(apiURL)
            .get(`/api/v1/room/recent/${room_number}`)
            .then(res => {
                expect(res.status).to.be.oneOf([200, 404]);
                if (res.status === 200) {
                    expect(res.body).to.have.keys(['state', 'timestamp']);
                    const { state, timestamp } = res.body;
                    expect(state).to.be.oneOf([1, 0]);
                    expect(timestamp).to.satisfy(e => !isNaN(Date.parse(e)));
                }
                else if (res.status === 404) {
                    expect(res.body).to.have.key('msg');
                    expect(res.body.msg).to.equal('room does not exist');
                }
                done();
            })
            .catch(err => {
                done(err);
            });
    };

    const testInvalidRoomNumber = (room_number) => (done) => {
        request(apiURL)
            .get(`/api/v1/room/recent/${room_number}`)
            .then(res => {
                expect(res.status).to.equal(400);
                expect(res.body).to.have.key('msg');
                expect(res.body.msg).to.equal('invalid room number');
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
    });

    describe('Error handling.', () => {
        it('Invalid room number (-5)', testInvalidRoomNumber(-5));
    });

});