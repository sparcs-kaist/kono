import crypto from 'crypto';
import { generateToken } from '../../../lib/token';
import dockerConfig from '../../../lib/docker.config';
import db from '../../../db';

function hash(password) {
    const secret = process.env.PASSWORD_KEY || dockerConfig.env.PASSWORD_KEY;
    return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

export const login = async (req, res) => {

    const { password } = req.body;
    const domain = req.header('Origin')
        .replace('http://', '')
        .replace('https://', '');
    
    if (!password) {
        res.status(400);
        res.clearCookie('access_token', { domain });
        res.send({ msg: 'password field required' });
        return;
    }

    try {

        const admins = await db.instance
            .select('*')
            .from('admin');

        for (let { sid, password: passwordHashed } of admins) {
            if (hash(password) === passwordHashed) {
                
                try {
                    const token = await generateToken({ sid });
                    res.status(200);
                    res.cookie('access_token', token, {
                        maxAge: 1000 * 60 * 60,
                        domain
                    });
                    res.send({ msg: 'login success' });
                    return;
                } catch (err) {
                    res.status(500);
                    res.send({ msg: 'server error' });
                    console.log(err);
                    return;
                }

            }
        }

        res.status(403);
        res.clearCookie('access_token', { domain });
        res.send({ msg: 'wrong password' });

        return;

    } catch (err) {
        res.status(500);
        res.send({ msg: 'server error' });
        console.log(err);
        return;
    }

}

export const check = (req, res) => {

    if (req.admin)
        res.status(204);
    else
        res.status(403);

    res.end();

}

export const logout = (req, res) => {

    if (!req.admin) {
        res.status(403);
        res.end();
        return;
    }

    const domain = req.header('Origin')
        .replace('http://', '')
        .replace('https://', '');

    res.status(204);
    res.clearCookie('access_token', { domain });
    res.end();

}

export const updatePassword = async (req, res) => {

    if (!req.admin) {
        res.status(403);
        res.end();
        return;
    }

    const { password } = req.body;

    if (!password) {
        res.status(400);
        res.send({ msg: 'password field required' });
        return;
    }
    if (typeof password !== 'string' || password.length > 20) {
        res.status(400);
        res.send({ msg: 'invalid password' });
        return;
    }

    const { sid } = req.admin;

    try {
        await db.authorizedInstance('admin')
            .where({ sid })
            .update({
                password: hash(password)
            });

        res.status(204);
        res.end();
        return;

    } catch (err) {
        res.status(500);
        res.send({ msg: 'server error' });
        console.log(err);
        return;
    }

}
