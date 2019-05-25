import { verify } from '../../../db/models/admin';
import { generateToken } from '../../../lib/token';

export const login = (req, res) => {
    
    const { password } = req.body;
    const { DEV_HOST: devHost } = process.env;
    const host = devHost;

    verify(password, () => {
        generateToken({ admin: 'true' },
            (token) => {
                res.status(200);
                res.cookie('access_token', token, {
                    maxAge: 1000 * 60 * 60,
                    httpOnly: true,
                    domain: host
                });
                res.send({ msg: 'login success' });
            },
            (error) => {
                res.status(500);
                res.send({ msg: 'server error' });
                console.log(error);
            }
        );
    }, () => {
        res.status(403);
        res.clearCookie('access_token');
        res.send({ msg: 'wrong password' })
    });

};

export const check = (req, res) => {
    if (req.admin)
        res.status(204);
    else
        res.status(403);
    res.end();
};